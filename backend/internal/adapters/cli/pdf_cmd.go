package cli

import (
	"fmt"
	"os"

	"toolkit/backend/internal/core/services"

	"github.com/spf13/cobra"
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

	var pages string
	var rotation int

	var extractCmd = &cobra.Command{
		Use:   "extract [input.pdf] [output.pdf]",
		Short: "Ekstrak halaman tertentu dari PDF (contoh flag: --pages 1-3,5)",
		Args:  cobra.ExactArgs(2),
		RunE: func(cmd *cobra.Command, args []string) error {
			if err := pdfSvc.Extract(args[0], args[1], pages); err != nil {
				return err
			}
			fmt.Println("Halaman berhasil diekstrak!")
			return nil
		},
	}
	extractCmd.Flags().StringVarP(&pages, "pages", "p", "", "Halaman (contoh: 1,3-5) [Wajib]")

	var removeCmd = &cobra.Command{
		Use:   "remove [input.pdf] [output.pdf]",
		Short: "Hapus halaman tertentu dari PDF",
		Args:  cobra.ExactArgs(2),
		RunE: func(cmd *cobra.Command, args []string) error {
			if err := pdfSvc.Remove(args[0], args[1], pages); err != nil {
				return err
			}
			fmt.Println("Halaman berhasil dihapus!")
			return nil
		},
	}
	removeCmd.Flags().StringVarP(&pages, "pages", "p", "", "Halaman yang dihapus (contoh: 1,3-5) [Wajib]")

	var rotateCmd = &cobra.Command{
		Use:   "rotate [input.pdf] [output.pdf]",
		Short: "Putar halaman PDF (90, 180, 270)",
		Args:  cobra.ExactArgs(2),
		RunE: func(cmd *cobra.Command, args []string) error {
			if err := pdfSvc.Rotate(args[0], args[1], pages, rotation); err != nil {
				return err
			}
			fmt.Println("Halaman berhasil diputar!")
			return nil
		},
	}
	rotateCmd.Flags().StringVarP(&pages, "pages", "p", "", "Halaman yang diputar (kosongkan untuk semua)")
	rotateCmd.Flags().IntVarP(&rotation, "rotation", "r", 90, "Derajat putaran (90, 180, 270)")

	rootCmd.AddCommand(extractCmd, removeCmd, rotateCmd)

	rootCmd.AddCommand(encryptCmd)
	rootCmd.AddCommand(decryptCmd)
}