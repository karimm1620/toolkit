FROM golang:1.21-alpine AS builder
WORKDIR /app
# Install dependencies for go-webp / CGO (if required)
RUN apk add --no-cache gcc musl-dev libwebp-dev
COPY go.mod go.sum ./
RUN go mod download
COPY . .
# Build Server
RUN go build -o server ./cmd/server
# Build CLI
RUN go build -o pdf-tool ./cmd/cli

FROM alpine:latest
# Install LibreOffice for Word to PDF conversions
RUN apk add --no-cache libreoffice
WORKDIR /app
COPY --from=builder /app/server .
COPY --from=builder /app/pdf-tool /usr/local/bin/pdf-tool
EXPOSE 3000
CMD ["./server"]