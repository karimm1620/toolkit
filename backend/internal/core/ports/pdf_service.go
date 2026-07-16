package ports

type PDFService interface {
	Merge(inputPaths []string, outputPath string) error
	Split(inputPath string, outputDir string, span int) error
	// Tambahan baru:
	Encrypt(inputPath, outputPath, password string) error
	Decrypt(inputPath, outputPath, password string) error
}