package rest

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/gofiber/fiber/v2"
	"toolkit/backend/internal/core/ports"
	"toolkit/backend/internal/utils"
)

type autoCleanFile struct {
	*os.File
}

func (f *autoCleanFile) Close() error {
	err := f.File.Close()
	os.Remove(f.Name())
	return err
}

type PDFHandler struct {
	svc ports.PDFService
}

func NewPDFHandler(svc ports.PDFService) *PDFHandler {
	return &PDFHandler{svc: svc}
}

func (h *PDFHandler) Merge(c *fiber.Ctx) error {
	form, err := c.MultipartForm()
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid form"})
	}

	files := form.File["pdfs"]
	if len(files) < 2 {
		return c.Status(400).JSON(fiber.Map{"error": "butuh minimal 2 PDF"})
	}

	var inputPaths []string
	
	// Simpan file sementara ke disk
	for i, fileHeader := range files {
		tempPath := filepath.Join(os.TempDir(), fmt.Sprintf("upload_%d_%s", i, fileHeader.Filename))
		if err := c.SaveFile(fileHeader, tempPath); err == nil {
			inputPaths = append(inputPaths, tempPath)
		}
	}

	// Otomatis hapus file input sementara setelah selesai
	defer func() {
		for _, path := range inputPaths {
			os.Remove(path)
		}
	}()

	tempOut := filepath.Join(os.TempDir(), "merged_output.pdf")
	defer os.Remove(tempOut)

	if err := h.svc.Merge(inputPaths, tempOut); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	c.Set("Content-Disposition", `attachment; filename="merged_output.pdf"`)
	return c.SendFile(tempOut)
}

func (h *PDFHandler) Split(c *fiber.Ctx) error {
	fileHeader, err := c.FormFile("pdf")
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "pdf file is required"})
	}

	tempIn := filepath.Join(os.TempDir(), fileHeader.Filename)
	if err := c.SaveFile(fileHeader, tempIn); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to save file"})
	}
	defer os.Remove(tempIn)

	outDir, _ := os.MkdirTemp("", "pdf-split-*")
	defer os.RemoveAll(outDir)

	if err := h.svc.Split(tempIn, outDir, 1); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	zipPath := filepath.Join(os.TempDir(), "split_pages.zip")
	if err := utils.ZipDirectory(outDir, zipPath); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to zip"})
	}

	zipFile, err := os.Open(zipPath)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to open zip"})
	}

	c.Set("Content-Disposition", `attachment; filename="split_pages.zip"`)
	return c.SendStream(&autoCleanFile{zipFile})
}

// Security

func (h *PDFHandler) handleSecurity(c *fiber.Ctx, action func(string, string, string) error) error {
	fileHeader, err := c.FormFile("pdf")
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "File PDF dibutuhkan"})
	}

	password := c.FormValue("password")
	if password == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Password tidak boleh kosong"})
	}

	tempIn := filepath.Join(os.TempDir(), "in_"+fileHeader.Filename)
	if err := c.SaveFile(fileHeader, tempIn); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Gagal menyimpan file"})
	}
	defer os.Remove(tempIn)

	tempOut := filepath.Join(os.TempDir(), "out_"+fileHeader.Filename)
	defer os.Remove(tempOut) // Akan dihapus setelah stream selesai oleh autoCleanFile

	if err := action(tempIn, tempOut, password); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	outFile, err := os.Open(tempOut)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Gagal membaca output"})
	}

	c.Set("Content-Disposition", `attachment; filename="secure_`+fileHeader.Filename+`"`)
	return c.SendStream(&autoCleanFile{outFile})
}

func (h *PDFHandler) Encrypt(c *fiber.Ctx) error {
	return h.handleSecurity(c, h.svc.Encrypt)
}

func (h *PDFHandler) Decrypt(c *fiber.Ctx) error {
	return h.handleSecurity(c, h.svc.Decrypt)
}