package ports

import "io"

type ImageOptions struct {
	Width      int
	Height     int
	Percentage int
	Format     string 
	CropWidth  int
	CropHeight int
	Rotate     float64
	FlipH      bool
	FlipV      bool
	// Tambahan baru:
	Quality    int // Nilai 1-100 (Default 85)
}

type ImageService interface {
	ProcessImage(input io.Reader, output io.Writer, opts ImageOptions) error
}