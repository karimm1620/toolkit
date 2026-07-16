package cli

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
	"toolkit/backend/internal/core/ports"
	"toolkit/backend/internal/core/services"
)

var (
	width  int
	height int
	format string
)

func Execute() {
	var rootCmd = &cobra.Command{
		Use:   "pdf-tool",
		Short: "Toolkit lintas platform untuk pemrosesan dokumen dan gambar",
	}

	// 1. Registrasi Command PDF (dari file pdf_cmd.go)
	AddPDFCommands(rootCmd)

	// 2. Registrasi Command Konversi (dari file convert_cmd.go)
	AddConvertCommands(rootCmd)

	// 3. Command Gambar (Langsung di root.go atau bisa dipindah ke image_cmd.go nantinya)
	imgSvc := services.NewImageService()
	var resizeCmd = &cobra.Command{
		Use:   "resize [input] [output]",
		Short: "Ubah ukuran gambar",
		Args:  cobra.ExactArgs(2),
		RunE: func(cmd *cobra.Command, args []string) error {
			inputPath := args[0]
			outputPath := args[1]

			in, err := os.Open(inputPath)
			if err != nil {
				return fmt.Errorf("gagal membuka file input: %w", err)
			}
			defer in.Close()

			out, err := os.Create(outputPath)
			if err != nil {
				return fmt.Errorf("gagal membuat file output: %w", err)
			}
			defer out.Close()

			opts := ports.ImageOptions{Width: width, Height: height, Format: format}
			if err := imgSvc.ProcessImage(in, out, opts); err != nil {
				return err
			}

			fmt.Println("Gambar berhasil diproses:", outputPath)
			return nil
		},
	}

	resizeCmd.Flags().IntVarP(&width, "width", "W", 0, "Target lebar")
	resizeCmd.Flags().IntVarP(&height, "height", "H", 0, "Target tinggi")
	resizeCmd.Flags().StringVarP(&format, "format", "f", "jpeg", "Format output (jpeg, png, webp)")
	
	rootCmd.AddCommand(resizeCmd)

	// Eksekusi CLI
	if err := rootCmd.Execute(); err != nil {
		os.Exit(1)
	}
}