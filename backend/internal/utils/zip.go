package utils

import (
	"archive/zip"
	"fmt"
	"io"
	"os"
	"path/filepath"
)

// ZipDirectory compresses the contents of a directory into a single zip file.
func ZipDirectory(sourceDir, zipFilePath string) error {
	zipFile, err := os.Create(zipFilePath)
	if err != nil {
		return fmt.Errorf("failed to create zip file: %w", err)
	}
	defer zipFile.Close()

	archive := zip.NewWriter(zipFile)
	defer archive.Close()

	err = filepath.Walk(sourceDir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		// Skip directories (pdfcpu split outputs a flat list of files)
		if info.IsDir() {
			return nil
		}

		// Use relative paths inside the zip so it extracts cleanly without full OS paths
		relPath, err := filepath.Rel(sourceDir, path)
		if err != nil {
			return err
		}

		header, err := zip.FileInfoHeader(info)
		if err != nil {
			return err
		}
		header.Name = relPath
		header.Method = zip.Deflate // Use standard compression

		writer, err := archive.CreateHeader(header)
		if err != nil {
			return err
		}

		fileToZip, err := os.Open(path)
		if err != nil {
			return err
		}
		defer fileToZip.Close()

		_, err = io.Copy(writer, fileToZip)
		return err
	})

	if err != nil {
		return fmt.Errorf("failed to walk and zip directory: %w", err)
	}

	return nil
}