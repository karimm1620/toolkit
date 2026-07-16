package ports

type PDFService interface {
	Merge(inputPaths []string, outputPath string) error
	Split(inputPath string, outputDir string, span int) error
	Encrypt(inputPath, outputPath, password string) error
	Decrypt(inputPath, outputPath, password string) error
	Extract(inputPath, outputPath, pages string) error
	Remove(inputPath, outputPath, pages string) error
	Rotate(inputPath, outputPath, pages string, rotation int) error
	Compress(inputPath, outputPath string) error
	AddWatermark(inputPath, outputPath, text string) error
	AddPageNumbers(inputPath, outputPath string) error
}