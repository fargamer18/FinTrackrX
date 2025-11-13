#!/bin/bash
# FinTrackrX Spring Boot - Quick Start Script for Linux/Mac

echo "========================================"
echo " FinTrackrX Spring Boot - Quick Start"
echo "========================================"
echo ""

# Check if Java is installed
echo "[1/5] Checking Java installation..."
if ! command -v java &> /dev/null; then
    echo "ERROR: Java is not installed or not in PATH"
    echo "Please install Java 17 or higher"
    exit 1
fi
java -version
echo ""

# Check if Maven is installed
echo "[2/5] Checking Maven installation..."
if ! command -v mvn &> /dev/null; then
    echo "ERROR: Maven is not installed or not in PATH"
    echo "Please install Maven from https://maven.apache.org/"
    exit 1
fi
mvn -version
echo ""

# Check if PostgreSQL is running
echo "[3/5] Checking PostgreSQL..."
echo "Please ensure PostgreSQL is running and database 'fintrackrx' exists"
echo ""

# Configure application properties
echo "[4/5] Configuration Check..."
if [ ! -f "src/main/resources/application.properties" ]; then
    echo "ERROR: application.properties not found"
    echo "Please create it from the template"
    exit 1
fi
echo "Configuration file found!"
echo ""

# Build and run
echo "[5/5] Starting application..."
echo "Building with Maven..."
mvn clean install -DskipTests
if [ $? -ne 0 ]; then
    echo "ERROR: Build failed"
    exit 1
fi

echo ""
echo "========================================"
echo " Starting Spring Boot Application..."
echo "========================================"
echo ""
echo "Application will be available at: http://localhost:8080"
echo "Press Ctrl+C to stop the application"
echo ""

mvn spring-boot:run
