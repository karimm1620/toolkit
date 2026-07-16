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
	Quality    int
}

type ImageService interface {
	ProcessImage(input io.Reader, output io.Writer, opts ImageOptions) error
}