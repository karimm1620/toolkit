# Build executable (bernama 'pdf-tool' di Mac/Linux, atau 'pdf-tool.exe' di Windows)
go build -o pdf-tool ./cmd/cli

# Jalankan perintah bantuan
./pdf-tool --help

# Contoh memisahkan PDF
./pdf-tool split dokumen.pdf ./hasil-split

# Contoh mengubah ukuran gambar
./pdf-tool resize foto.jpg hasil.webp --width 800 --format webp

docker-compose up --build -d