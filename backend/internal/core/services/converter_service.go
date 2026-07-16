package services

import (
	"fmt"
	"os/exec"
	"path/filepath"
	"strings"
	"toolkit/backend/internal/core/ports"
)

type converterService struct{}

func NewConverterService() ports.ConverterService {
	return &converterService{}
}

func (s *converterService) WordToPDF(inputPath, outputDir string) (string, error) {
	// Perintah eksekusi: soffice --headless --convert-to pdf --outdir [dir] [file]
	cmd := exec.Command("soffice", "--headless", "--convert-to", "pdf", "--outdir", outputDir, inputPath)
	
	if err := cmd.Run(); err != nil {
		return "", fmt.Errorf("gagal konversi ke PDF. Pastikan LibreOffice terinstall: %w", err)
	}

	// LibreOffice akan membuat file dengan nama yang sama tapi ekstensi .pdf
	baseName := strings.TrimSuffix(filepath.Base(inputPath), filepath.Ext(inputPath))
	return filepath.Join(outputDir, baseName+".pdf"), nil
}

func (s *converterService) PDFToWord(inputPath, outputDir string) (string, error) {
	// Menggunakan infilter khusus agar PDF dibaca sebagai dokumen teks
	cmd := exec.Command("soffice", "--infilter=writer_pdf_import", "--headless", "--convert-to", "docx", "--outdir", outputDir, inputPath)
	
	if err := cmd.Run(); err != nil {
		return "", fmt.Errorf("gagal konversi ke Word: %w", err)
	}

	baseName := strings.TrimSuffix(filepath.Base(inputPath), filepath.Ext(inputPath))
	return filepath.Join(outputDir, baseName+".docx"), nil
}