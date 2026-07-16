FROM golang:1.21-alpine AS builder

RUN apk add --no-cache gcc musl-dev libwebp-dev

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=1 GOOS=linux go build -o server ./cmd/server
RUN CGO_ENABLED=1 GOOS=linux go build -o pdf-tool ./cmd/cli

FROM alpine:latest

RUN apk add --no-cache libwebp

WORKDIR /app

COPY --from=builder /app/server .
COPY --from=builder /app/pdf-tool .

RUN mkdir -p /tmp && chmod 777 /tmp

EXPOSE 3000

CMD ["./server"]