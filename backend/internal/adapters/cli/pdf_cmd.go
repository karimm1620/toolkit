package cli

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
	"toolkit/backend/internal/core/services"
)

func AddPDFCommands(rootCmd *cobra.Command) {
	pdfSvc := services.NewPDFService()

	var mergeCmd = &cobra.Command{
		Use:   "merge [output.pdf] [input1.pdf] [input2.pdf]...",
		Short: "Merge multiple PDFs into a single file",
		Args:  cobra.MinimumNArgs(3),
		RunE: func(cmd *cobra.Command, args []string) error {
			outputPath := args[0]
			inputPaths := args[1:]

			if err := pdfSvc.Merge(inputPaths, outputPath); err != nil {
				return err
			}

			fmt.Printf("Berhasil menggabungkan %d file ke %s\n", len(inputPaths), outputPath)
			return nil
		},
	}

	var splitCmd = &cobra.Command{
		Use:   "split [input.pdf] [output_dir]",
		Short: "Split a PDF into single pages",
		Args:  cobra.ExactArgs(2),
		RunE: func(cmd *cobra.Command, args []string) error {
			inputPath := args[0]
			outDir := args[1]

			if err := os.MkdirAll(outDir, 0755); err != nil {
				return err
			}

			if err := pdfSvc.Split(inputPath, outDir, 1); err != nil {
				return err
			}

			fmt.Printf("Berhasil memisahkan PDF %s ke folder %s\n", inputPath, outDir)
			return nil
		},
	}

	rootCmd.AddCommand(mergeCmd)
	rootCmd.AddCommand(splitCmd)

	var password string

	var encryptCmd = &cobra.Command{
		Use:   "encrypt [input.pdf] [output.pdf]",
		Short: "Menambahkan password ke PDF",
		Args:  cobra.ExactArgs(2),
		RunE: func(cmd *cobra.Command, args []string) error {
			if password == "" {
				return fmt.Errorf("flag --password wajib diisi")
			}
			if err := pdfSvc.Encrypt(args[0], args[1], password); err != nil {
				return err
			}
			fmt.Println("PDF berhasil dikunci!")
			return nil
		},
	}
	encryptCmd.Flags().StringVarP(&password, "password", "p", "", "Password untuk PDF")

	var decryptCmd = &cobra.Command{
		Use:   "decrypt [input.pdf] [output.pdf]",
		Short: "Menghapus password dari PDF",
		Args:  cobra.ExactArgs(2),
		RunE: func(cmd *cobra.Command, args []string) error {
			if password == "" {
				return fmt.Errorf("flag --password wajib diisi")
			}
			if err := pdfSvc.Decrypt(args[0], args[1], password); err != nil {
				return err
			}
			fmt.Println("Password PDF berhasil dihapus!")
			return nil
		},
	}
	decryptCmd.Flags().StringVarP(&password, "password", "p", "", "Password lama PDF")

	rootCmd.AddCommand(encryptCmd)
	rootCmd.AddCommand(decryptCmd)
}