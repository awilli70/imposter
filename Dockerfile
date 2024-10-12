# Stage 1: Build the Vite React Frontend
FROM node:18 AS frontend-builder

# Set the working directory for the frontend
WORKDIR /app/ui

# Copy package.json and package-lock.json
COPY ./ui/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend application
COPY ./ui ./

# Build the frontend application
RUN npm run build

# Stage 2: Build the Go (Gin) Backend
FROM golang:1.23 AS backend-builder

# Set the Current Working Directory for the backend
WORKDIR /app

# Copy go.mod and go.sum files first for caching dependencies
COPY ./go.mod ./go.sum ./
RUN go mod download

# Copy the source code into the container
COPY . .

# Copy built frontend files from the previous stage
COPY --from=frontend-builder /app/ui/ ./ui

# Build the Go app
RUN CGO_ENABLED=0 go build -o main .

# Stage 3: Create the final runtime image
FROM alpine:latest

# Set the Current Working Directory
WORKDIR /app

# Copy the Pre-built binary and frontend files from the previous stages
COPY --from=backend-builder /app/main .
COPY --from=backend-builder /app/ui ./ui

# Expose the port the app runs on
EXPOSE 8080

# Command to run the executable
CMD ["./main"]
