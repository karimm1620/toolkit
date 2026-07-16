package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	
	"toolkit/backend/internal/adapters/rest"
	"toolkit/backend/internal/core/services"
)

func main() {
	// Inisialisasi Fiber dengan batas ukuran body 100MB untuk file besar
	app := fiber.New(fiber.Config{
		BodyLimit: 100 * 1024 * 1024,
	})

	// Mengaktifkan CORS agar frontend React (port 5173) bisa menembak API (port 3000)
	app.Use(cors.New())

	// Fitur Gambar
	imgSvc := services.NewImageService()
	imgHandler := rest.NewImageHandler(imgSvc)

	// Fitur PDF (Merge & Split)
	pdfSvc := services.NewPDFService()
	pdfHandler := rest.NewPDFHandler(pdfSvc)

	// Fitur Konversi (Word <-> PDF)
	convSvc := services.NewConverterService()
	convHandler := rest.NewConvertHandler(convSvc)

	api := app.Group("/api")

	// Endpoint Gambar
	api.Post("/image/resize", imgHandler.Resize)

	// Endpoint PDF
	api.Post("/pdf/merge", pdfHandler.Merge)
	api.Post("/pdf/split", pdfHandler.Split)

	// Endpoint Konversi Dokumen
	api.Post("/convert/word-to-pdf", convHandler.WordToPDF)
	api.Post("/convert/pdf-to-word", convHandler.PDFToWord)

	// Endpoint Encrypt Dokumen
	api.Post("/pdf/encrypt", pdfHandler.Encrypt)
	api.Post("/pdf/decrypt", pdfHandler.Decrypt)

	// Endpoint Manipulasi Page
	api.Post("/pdf/pages", pdfHandler.ManipulatePages)

	log.Println("Server berjalan di http://localhost:3000")
	log.Fatal(app.Listen(":3000"))
}