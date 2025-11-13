# FinTrackrX - Hybrid Architecture

## Architecture Overview

This project now uses a **hybrid architecture**:
- **Frontend**: Next.js 16 with React 18 and TypeScript
- **Backend**: Spring Boot 3.2.0 REST API with Java 17

## Running the Application

### Prerequisites
- Node.js 18+ (for Next.js frontend)
- Java 17 (for Spring Boot backend)
- Maven 3.9+ (for building backend)

### Step 1: Start the Spring Boot Backend

```powershell
# Start the backend API on port 8080
mvn spring-boot:run
```

The backend will be available at: http://localhost:8080

API endpoints:
- Health check: http://localhost:8080/api/health
- H2 Database console: http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:mem:fintrackrx`
  - Username: `sa`
  - Password: (leave empty)

### Step 2: Start the Next.js Frontend

```powershell
# Install dependencies (first time only)
npm install

# Start the development server
npm run dev
```

The frontend will be available at: http://localhost:3000

## Project Structure

```
fintrackrx/
├── app/                    # Next.js app directory (pages and routes)
├── components/             # React components
├── lib/                    # Utility functions and API client
│   └── api-config.ts      # Spring Boot API configuration
├── public/                 # Static assets
├── types/                  # TypeScript type definitions
├── src/                    # Spring Boot backend source
│   └── main/
│       └── java/
│           └── com/fintrackrx/
│               ├── controller/    # REST controllers
│               ├── model/         # JPA entities
│               ├── repository/    # Data access
│               ├── service/       # Business logic
│               └── security/      # JWT authentication
├── pom.xml                 # Maven dependencies
├── package.json            # npm dependencies
└── next.config.ts          # Next.js configuration
```

## API Integration

The Next.js frontend connects to the Spring Boot backend using the `api-config.ts` utility:

```typescript
import { apiRequest, API_ENDPOINTS } from '@/lib/api-config';

// Example: Login
const response = await apiRequest(API_ENDPOINTS.LOGIN, {
  method: 'POST',
  body: JSON.stringify({ email, password }),
});

// Store JWT token
localStorage.setItem('auth_token', response.token);
```

## Environment Variables

Create a `.env.local` file in the project root:

```env
# Spring Boot backend URL
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## Database

Currently using **H2 in-memory database** for development. Data is lost when the backend restarts.

To switch to PostgreSQL:
1. Install PostgreSQL
2. Create database: `CREATE DATABASE fintrackrx;`
3. Update `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/fintrackrx
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
```

## Authentication Flow

1. User signs up/logs in via Next.js frontend
2. Frontend sends credentials to Spring Boot `/api/auth/login`
3. Backend validates credentials and returns JWT token
4. Frontend stores token in localStorage
5. All subsequent requests include `Authorization: Bearer <token>` header
6. Spring Boot validates JWT on protected endpoints

## Development Workflow

### Frontend Development
```powershell
npm run dev          # Start Next.js dev server with hot reload
npm run build        # Build for production
npm run start        # Start production server
npm test            # Run tests
```

### Backend Development
```powershell
mvn spring-boot:run      # Start with hot reload (DevTools enabled)
mvn clean package        # Build JAR file
mvn test                 # Run tests
```

## API Documentation

Once the backend is running, you can test endpoints using:
- **Postman Collection**: Import `FinTrackrX-API.postman_collection.json`
- **cURL examples**: See `README-SPRINGBOOT.md`

## Key Features

### Implemented
- ✅ User authentication (signup, login, logout)
- ✅ JWT token-based security
- ✅ Account management (CRUD operations)
- ✅ Investment tracking
- ✅ Email verification (template ready)
- ✅ Password reset flow
- ✅ Health check endpoints
- ✅ H2 in-memory database

### Pending
- ⏳ Transaction management
- ⏳ Budget tracking
- ⏳ 2FA/TOTP implementation
- ⏳ AI financial advisor
- ⏳ Stock price API integration
- ⏳ Email service configuration (SMTP)

## Troubleshooting

### Backend Issues
- **Port 8080 already in use**: Stop other applications or change port in `application.properties`
- **Database errors**: Check H2 console at http://localhost:8080/h2-console
- **Maven build fails**: Ensure Java 17 is installed: `java -version`

### Frontend Issues
- **API connection fails**: Ensure backend is running on port 8080
- **CORS errors**: Spring Boot is configured to allow localhost:3000
- **Module not found**: Run `npm install` to install dependencies

## Migration Notes

This project was migrated from:
- **From**: Full Next.js application with Next.js API routes
- **To**: Next.js frontend + Spring Boot backend

All backend logic (authentication, database operations, business logic) now runs in Spring Boot. The Next.js app directory only contains UI pages and components.

## Previous Version

The original Next.js-only version is preserved in the `nextjs-backup/` folder.
