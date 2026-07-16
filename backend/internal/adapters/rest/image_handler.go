package rest

import (
	"fmt"
	"os"
	"strconv"

	"toolkitz/backend/internal/core/ports"

	"github.com/gofiber/fiber/v2"
)

type ImageHandler struct {
	svc ports.ImageService
}

func NewImageHandler(svc ports.ImageService) *ImageHandler {
	return &ImageHandler{svc: svc}
}

func (h *ImageHandler) Resize(c *fiber.Ctx) error {
	file, err := c.FormFile("image")
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "File gambar dibutuhkan"})
	}

	// Mengambil parameter dari form-data
	width, _ := strconv.Atoi(c.FormValue("width", "0"))
	height, _ := strconv.Atoi(c.FormValue("height", "0"))
	cropW, _ := strconv.Atoi(c.FormValue("crop_width", "0"))
	cropH, _ := strconv.Atoi(c.FormValue("crop_height", "0"))
	rotate, _ := strconv.ParseFloat(c.FormValue("rotate", "0"), 64)
	quality, _ := strconv.Atoi(c.FormValue("quality", "85"))
	format := c.FormValue("format", "jpeg")
	flipH := c.FormValue("flip_h") == "true"
	flipV := c.FormValue("flip_v") == "true"

	src, err := file.Open()
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Gagal membaca file"})
	}
	defer src.Close()

	tempOut, err := os.CreateTemp("", "out-*.img")
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Gagal membuat file sementara"})
	}
	defer os.Remove(tempOut.Name())
	defer tempOut.Close()

	opts := ports.ImageOptions{
		Width: width, Height: height, Format: format,
		CropWidth: cropW, CropHeight: cropH,
		Rotate: rotate, FlipH: flipH, FlipV: flipV,
		Quality: quality,
	}

	if err := h.svc.ProcessImage(src, tempOut, opts); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	c.Set("Content-Disposition", fmt.Sprintf(`attachment; filename="processed.%s"`, format))
	return c.SendFile(tempOut.Name())
}