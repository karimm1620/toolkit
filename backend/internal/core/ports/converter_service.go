package ports

type ConverterService interface {
	// Mengembalikan path file hasil konversi
	WordToPDF(inputPath, outputDir string) (string, error)
	PDFToWord(inputPath, outputDir string) (string, error)
}