package services

import (
	"fmt"
	"image"
	"image/jpeg"
	"image/png"
	"io"
	"strings"

	"github.com/disintegration/imaging"
	"github.com/kolesa-team/go-webp/encoder"
	"github.com/kolesa-team/go-webp/webp"
	"toolkit/backend/internal/core/ports"
)

type imageService struct{}

func NewImageService() ports.ImageService {
	return &imageService{}
}

func (s *imageService) ProcessImage(input io.Reader, output io.Writer, opts ports.ImageOptions) error {
	img, _, err := image.Decode(input)
	if err != nil {
		return fmt.Errorf("failed to decode image: %w", err)
	}

	// 1. Resize
	if opts.Percentage > 0 {
		bounds := img.Bounds()
		newWidth := int(float64(bounds.Dx()) * (float64(opts.Percentage) / 100.0))
		img = imaging.Resize(img, newWidth, 0, imaging.Lanczos)
	} else if opts.Width > 0 || opts.Height > 0 {
		img = imaging.Resize(img, opts.Width, opts.Height, imaging.Lanczos)
	}

	// 2. Encode to format
	format := strings.ToLower(opts.Format)
	switch format {
	case "png":
		return png.Encode(output, img)
	case "webp":
		options, _ := encoder.NewLossyEncoderOptions(encoder.PresetDefault, 75)
		return webp.Encode(output, img, options)
	default:
		return jpeg.Encode(output, img, &jpeg.Options{Quality: 85})
	}
}