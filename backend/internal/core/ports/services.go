package ports

import "io"

type ImageOptions struct {
	Width      int
	Height     int
	Percentage int
	Format     string // "jpeg", "png", "webp"
	
	// Parameter Baru
	CropWidth  int
	CropHeight int
	Rotate     float64 // Derajat putaran (contoh: 90, 180, 270)
	FlipH      bool    // Horizontal Flip
	FlipV      bool    // Vertical Flip
}

type ImageService interface {
	ProcessImage(input io.Reader, output io.Writer, opts ImageOptions) error
}