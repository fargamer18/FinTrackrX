@echo off
REM FinTrackrX Spring Boot - Quick Start Script for Windows

echo ========================================
echo  FinTrackrX Spring Boot - Quick Start
echo ========================================
echo.

REM Check if Java is installed
echo [1/5] Checking Java installation...
java -version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Java is not installed or not in PATH
    echo Please install Java 17 or higher from https://adoptium.net/
    pause
    exit /b 1
)
echo Java is installed!
echo.

REM Check if Maven is installed
echo [2/5] Checking Maven installation...
mvn -version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Maven is not installed or not in PATH
    echo Please install Maven from https://maven.apache.org/
    pause
    exit /b 1
)
echo Maven is installed!
echo.

REM Check if PostgreSQL is running
echo [3/5] Checking PostgreSQL...
echo Please ensure PostgreSQL is running and database 'fintrackrx' exists
echo.

REM Configure application properties
echo [4/5] Configuration Check...
if not exist "src\main\resources\application.properties" (
    echo ERROR: application.properties not found
    echo Please create it from the template
    pause
    exit /b 1
)
echo Configuration file found!
echo.

REM Build and run
echo [5/5] Starting application...
echo Building with Maven...
call mvn clean install -DskipTests
if errorlevel 1 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo  Starting Spring Boot Application...
echo ========================================
echo.
echo Application will be available at: http://localhost:8080
echo Press Ctrl+C to stop the application
echo.

call mvn spring-boot:run

pause
