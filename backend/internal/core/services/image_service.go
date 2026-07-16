package services

import (
	"fmt"
	"image"
	"image/color"
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
		return fmt.Errorf("gagal membaca gambar: %w", err)
	}

	// 1. Crop Center (Potong dari titik tengah)
	if opts.CropWidth > 0 && opts.CropHeight > 0 {
		img = imaging.CropCenter(img, opts.CropWidth, opts.CropHeight)
	}

	// 2. Resize
	if opts.Percentage > 0 {
		bounds := img.Bounds()
		newWidth := int(float64(bounds.Dx()) * (float64(opts.Percentage) / 100.0))
		img = imaging.Resize(img, newWidth, 0, imaging.Lanczos)
	} else if opts.Width > 0 || opts.Height > 0 {
		img = imaging.Resize(img, opts.Width, opts.Height, imaging.Lanczos)
	}

	// 3. Flip (Cermin)
	if opts.FlipH {
		img = imaging.FlipH(img)
	}
	if opts.FlipV {
		img = imaging.FlipV(img)
	}

	// 4. Rotate (Putar)
	if opts.Rotate != 0 {
		// Menggunakan warna background transparan
		img = imaging.Rotate(img, opts.Rotate, color.Transparent)
	}

	// 5. Encode ke Format Pilihan
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