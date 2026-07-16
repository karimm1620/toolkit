package rest

import (
	"fmt"
	"os"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"toolkit/backend/internal/core/ports"
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
		return c.Status(400).JSON(fiber.Map{"error": "image file required"})
	}

	width, _ := strconv.Atoi(c.FormValue("width", "0"))
	height, _ := strconv.Atoi(c.FormValue("height", "0"))
	format := c.FormValue("format", "jpeg")

	src, err := file.Open()
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to open file"})
	}
	defer src.Close()

	// Create temp file for output
	tempOut, err := os.CreateTemp("", "out-*.img")
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "server error"})
	}
	defer os.Remove(tempOut.Name())
	defer tempOut.Close()

	opts := ports.ImageOptions{Width: width, Height: height, Format: format}
	if err := h.svc.ProcessImage(src, tempOut, opts); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": fmt.Sprintf("processing failed: %v", err)})
	}

	c.Set("Content-Disposition", fmt.Sprintf(`attachment; filename="processed.%s"`, format))
	return c.SendFile(tempOut.Name())
}