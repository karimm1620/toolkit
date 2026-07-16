package cli

import (
	"fmt"
	"os"

	"toolkitz/backend/internal/core/services"

	"github.com/spf13/cobra"
)

func AddConvertCommands(rootCmd *cobra.Command) {
	convSvc := services.NewConverterService()

	// ---- COMMAND: Word ke PDF ----
	var wordToPdfCmd = &cobra.Command{
		Use:   "word2pdf [input.docx] [output_dir]",
		Short: "Konversi dokumen Word (.docx) menjadi PDF",
		Args:  cobra.ExactArgs(2),
		RunE: func(cmd *cobra.Command, args []string) error {
			inputPath := args[0]
			outDir := args[1]

			if err := os.MkdirAll(outDir, 0755); err != nil {
				return fmt.Errorf("gagal membuat direktori output: %w", err)
			}

			fmt.Println("Sedang mengkonversi Word ke PDF... (Membutuhkan LibreOffice)")
			
			outputPath, err := convSvc.WordToPDF(inputPath, outDir)
			if err != nil {
				return err
			}

			fmt.Printf("Berhasil! File tersimpan di: %s\n", outputPath)
			return nil
		},
	}

	// ---- COMMAND: PDF ke Word ----
	var pdfToWordCmd = &cobra.Command{
		Use:   "pdf2word [input.pdf] [output_dir]",
		Short: "Konversi dokumen PDF menjadi Word (.docx)",
		Args:  cobra.ExactArgs(2),
		RunE: func(cmd *cobra.Command, args []string) error {
			inputPath := args[0]
			outDir := args[1]

			if err := os.MkdirAll(outDir, 0755); err != nil {
				return fmt.Errorf("gagal membuat direktori output: %w", err)
			}

			fmt.Println("Sedang mengkonversi PDF ke Word... (Membutuhkan LibreOffice)")
			
			outputPath, err := convSvc.PDFToWord(inputPath, outDir)
			if err != nil {
				return err
			}

			fmt.Printf("Berhasil! File tersimpan di: %s\n", outputPath)
			return nil
		},
	}

	rootCmd.AddCommand(wordToPdfCmd)
	rootCmd.AddCommand(pdfToWordCmd)
}