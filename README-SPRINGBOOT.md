# FinTrackrX - Spring Boot Edition

A comprehensive financial tracking application built with Spring Boot, featuring expense tracking, investment portfolio management, AI-powered insights, and secure authentication.

## 🚀 Technology Stack

- **Backend Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Database**: PostgreSQL
- **Security**: Spring Security + JWT
- **ORM**: Spring Data JPA (Hibernate)
- **Build Tool**: Maven
- **Email**: Spring Mail (JavaMailSender)
- **2FA**: Google Authenticator (TOTP)

## 📋 Prerequisites

Before running this application, ensure you have:

- **Java 17** or higher installed
- **Maven 3.6+** installed
- **PostgreSQL 12+** installed and running
- IDE (IntelliJ IDEA, Eclipse, or VS Code with Java extensions)

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd fintrackrx
```

### 2. Set Up PostgreSQL Database

```bash
# Create the database
createdb fintrackrx

# Run the schema
psql -U your_username -d fintrackrx -f database/schema.sql
```

### 3. Configure Application Properties

Update `src/main/resources/application.properties` with your settings:

```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/fintrackrx
spring.datasource.username=your_db_username
spring.datasource.password=your_db_password

# JWT Configuration
jwt.secret=your-super-secret-jwt-key-change-this-in-production

# Mail Configuration (Gmail example)
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password

# API Keys (Optional - for external services)
finnhub.api.key=your-finnhub-api-key
openai.api.key=your-openai-api-key
```

### 4. Build the Project

```bash
mvn clean install
```

### 5. Run the Application

```bash
mvn spring-boot:run
```

Or run directly from your IDE by executing the `FinTrackrXApplication.java` main class.

The application will start on **http://localhost:8080**

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login with email/password |
| POST | `/api/auth/verify-email` | Verify email with token |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password with token |

### Account Endpoints (Authenticated)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/accounts` | Get all user accounts |
| POST | `/api/accounts` | Create a new account |
| PUT | `/api/accounts/{id}` | Update an account |
| DELETE | `/api/accounts/{id}` | Delete an account |

### Investment Endpoints (Authenticated)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/investments` | Get all user investments |
| POST | `/api/investments` | Add a new investment |
| PUT | `/api/investments/{id}` | Update an investment |
| DELETE | `/api/investments/{id}` | Delete an investment |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Application health status |
| GET | `/api/health/db` | Database connection status |

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. After logging in:

1. You'll receive a JWT token and refresh token
2. Include the token in the Authorization header for protected endpoints:

```
Authorization: Bearer <your-jwt-token>
```

## 📊 Features

### ✅ Implemented

- ✅ User Authentication (Signup, Login, JWT)
- ✅ Email Verification
- ✅ Password Reset Flow
- ✅ Account Management (CRUD)
- ✅ Investment Portfolio Management
- ✅ Spring Security with JWT
- ✅ PostgreSQL Database Integration
- ✅ RESTful API Design

### 🚧 In Progress / To Be Implemented

- Transaction Management
- Budget Tracking
- Financial Goals
- AI-Powered Insights
- 2FA (TOTP) Implementation
- Stock Price Sync
- Recurring Transactions
- Dashboard Analytics

## 🧪 Testing

Run tests with:

```bash
mvn test
```

## 📦 Building for Production

Create a production-ready JAR:

```bash
mvn clean package -DskipTests
```

The JAR file will be created in `target/fintrackrx-1.0.0.jar`

Run the JAR:

```bash
java -jar target/fintrackrx-1.0.0.jar
```

## 🔧 Development

### Project Structure

```
src/
├── main/
│   ├── java/com/fintrackrx/
│   │   ├── FinTrackrXApplication.java
│   │   ├── config/
│   │   │   └── SecurityConfig.java
│   │   ├── controller/
│   │   │   ├── AuthController.java
│   │   │   ├── AccountController.java
│   │   │   ├── InvestmentController.java
│   │   │   └── HealthController.java
│   │   ├── dto/
│   │   ├── model/
│   │   ├── repository/
│   │   ├── security/
│   │   └── service/
│   └── resources/
│       ├── application.properties
│       ├── templates/
│       └── static/
└── test/
```

## 🌐 Frontend Options

This is a backend API. You can build a frontend using:

1. **React** - Recommended for SPA
2. **Angular** - Enterprise-grade framework
3. **Vue.js** - Progressive framework
4. **Thymeleaf** - Server-side templates (basic templates included)

## 📝 Migration Notes

This project was migrated from Next.js to Spring Boot. Key changes:

- Next.js API routes → Spring Boot REST Controllers
- PostgreSQL schema remains the same
- JWT authentication implemented with Spring Security
- Email service using JavaMailSender
- All business logic migrated to Spring services

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review API endpoints in the code

## 🎯 Roadmap

- [ ] Complete transaction management
- [ ] Implement budget tracking features
- [ ] Add comprehensive unit tests
- [ ] Create Swagger/OpenAPI documentation
- [ ] Docker containerization
- [ ] CI/CD pipeline setup
- [ ] Frontend React application
