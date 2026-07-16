package services

import (
	"toolkitz/backend/internal/core/ports"

	"github.com/pdfcpu/pdfcpu/pkg/api"
	"github.com/pdfcpu/pdfcpu/pkg/pdfcpu/model"
)

type pdfService struct{}

func NewPDFService() ports.PDFService {
	return &pdfService{}
}

func (s *pdfService) Merge(inputPaths []string, outputPath string) error {
	conf := model.NewDefaultConfiguration()
	
	return api.MergeCreateFile(inputPaths, outputPath, false, conf)
}

func (s *pdfService) Split(inputPath, outputDir string, span int) error {
	if span <= 0 {
		span = 1
	}
	conf := model.NewDefaultConfiguration()
	
	return api.SplitFile(inputPath, outputDir, span, conf)
}

func (s *pdfService) Encrypt(inputPath, outputPath, password string) error {
	conf := model.NewDefaultConfiguration()
	// Set user password dan owner password
	conf.UserPW = password
	conf.OwnerPW = password

	return api.EncryptFile(inputPath, outputPath, conf)
}

func (s *pdfService) Decrypt(inputPath, outputPath, password string) error {
	conf := model.NewDefaultConfiguration()
	// Berikan password untuk membuka kunci sebelum menghapusnya
	conf.UserPW = password
	conf.OwnerPW = password

	return api.DecryptFile(inputPath, outputPath, conf)
}

func (s *pdfService) Extract(inputPath, outputPath, pages string) error {
	conf := model.NewDefaultConfiguration()
	// TrimFile
	return api.TrimFile(inputPath, outputPath, []string{pages}, conf)
}

func (s *pdfService) Remove(inputPath, outputPath, pages string) error {
	conf := model.NewDefaultConfiguration()
	// RemovePagesFile
	return api.RemovePagesFile(inputPath, outputPath, []string{pages}, conf)
}

func (s *pdfService) Rotate(inputPath, outputPath, pages string, rotation int) error {
	conf := model.NewDefaultConfiguration()
	var pageSelection []string
	if pages != "" {
		pageSelection = []string{pages}
	}
	// RotateFile
	return api.RotateFile(inputPath, outputPath, rotation, pageSelection, conf)
}

func (s *pdfService) Compress(inputPath, outputPath string) error {
	conf := model.NewDefaultConfiguration()
	// OptimizeFile
	return api.OptimizeFile(inputPath, outputPath, conf)
}

func (s *pdfService) AddWatermark(inputPath, outputPath, text string) error {
	conf := model.NewDefaultConfiguration()
	
	// Konfigurasi: Font Helvetica, ukuran 48, abu-abu, rotasi diagonal 45 derajat, opacity 50%
	wm, err := api.TextWatermark(text, "font:Helvetica, points:48, color:0.5 0.5 0.5, rot:45, op:0.5", true, false, 0)
	if err != nil {
		return err
	}
	
	return api.AddWatermarksFile(inputPath, outputPath, nil, wm, conf)
}

func (s *pdfService) AddPageNumbers(inputPath, outputPath string) error {
	conf := model.NewDefaultConfiguration()
	
	// Konfigurasi: Teks "Page X of Y", posisi Bottom-Center (bc), rotasi 0, solid (op:1)
	wm, err := api.TextWatermark("Page %p of %P", "font:Helvetica, points:12, pos:bc, rot:0, op:1", true, false, 0)
	if err != nil {
		return err
	}
	
	return api.AddWatermarksFile(inputPath, outputPath, nil, wm, conf)
}