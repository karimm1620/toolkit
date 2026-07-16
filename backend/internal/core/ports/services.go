package ports

import (
	"io"
)

type ImageOptions struct {
	Width      int
	Height     int
	Percentage int
	Format     string // "jpeg", "png", "webp"
}

type ImageService interface {
	ProcessImage(input io.Reader, output io.Writer, opts ImageOptions) error
}