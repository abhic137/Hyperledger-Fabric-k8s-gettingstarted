# This image is a microservice in golang for the Degree chaincode
FROM golang:1.19-alpine AS build

WORKDIR /go/src/github.com/basic

#COPY ./ /go/src/github.com/basic

COPY packaging /go/src/github.com/basic

COPY assetTransfer.go /go/src/github.com/basic

COPY go.mod /go/src/github.com/basic

COPY .dockerignore /go/src/github.com/basic

COPY ./ /go/src/github.com/basic

# Build application
RUN go mod tidy
RUN go mod vendor
RUN go build -o chaincode -v .

# Production ready image
# Pass the binary to the prod image
FROM alpine:3.11 as prod
WORKDIR /app
COPY --from=build /go/src/github.com/basic/chaincode /app/chaincode

USER 1000

CMD ./chaincode
