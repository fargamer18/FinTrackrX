# FinTrackrX - Spring Boot Migration Guide

## Migration from Next.js to Spring Boot

This document outlines the complete migration of FinTrackrX from a Next.js full-stack application to a Spring Boot backend with REST API architecture.

## What Was Migrated

### ✅ Completed Components

1. **Database Layer**
   - All PostgreSQL entities converted to JPA entities
   - Repositories created using Spring Data JPA
   - Database schema preserved (no changes needed)

2. **Authentication System**
   - JWT-based authentication with Spring Security
   - User signup and login
   - Email verification flow
   - Password reset functionality
   - Security configuration with CORS

3. **Core Features**
   - Account management (CRUD operations)
   - Investment portfolio management
   - Health check endpoints
   - Email service integration

4. **Project Structure**
   - Maven build configuration
   - Spring Boot application setup
   - Controller → Service → Repository architecture
   - DTOs for request/response handling

## File Mapping

### Next.js → Spring Boot

| Next.js Component | Spring Boot Equivalent |
|-------------------|------------------------|
| `app/api/auth/login/route.ts` | `AuthController.java` |
| `app/api/accounts/route.ts` | `AccountController.java` |
| `app/api/investments/route.ts` | `InvestmentController.java` |
| `lib/db.ts` | `application.properties` + JPA |
| `lib/auth.ts` | `AuthService.java` + `JwtTokenProvider.java` |
| `lib/email.ts` | `EmailService.java` |
| `package.json` | `pom.xml` |

## Features Requiring Additional Work

### 🚧 Partially Implemented

1. **2FA (Two-Factor Authentication)**
   - Dependencies added (Google Authenticator)
   - Service logic needs implementation
   - QR code generation setup required

2. **AI Advisor**
   - Model entities created
   - Controller and service need implementation
   - OpenAI API integration required

3. **Stock Price APIs**
   - Configuration properties added
   - Service implementation needed (Finnhub integration)

4. **Frontend**
   - Basic Thymeleaf templates created
   - Full React/Angular/Vue frontend needed for complete UI

### ❌ Not Yet Implemented

1. **Transaction Management**
   - Model and repository created
   - Service and controller needed

2. **Budget Tracking**
   - Database entities exist
   - Business logic not implemented

3. **Financial Goals**
   - Similar to budgets, needs service layer

4. **Recurring Transactions**
   - Entity created
   - Scheduling logic needed

## How to Continue Development

### Adding a New Feature (Example: Transactions)

1. **Create the Service**
```java
@Service
public class TransactionService {
    // Implement business logic
}
```

2. **Create the Controller**
```java
@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
    // Add REST endpoints
}
```

3. **Update Security Config** (if needed)
```java
.requestMatchers("/api/transactions/**").authenticated()
```

### Testing Your API

Use tools like:
- **Postman** - For manual API testing
- **cURL** - Command-line testing
- **JUnit + MockMvc** - Unit and integration tests

Example cURL:
```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Get accounts (with JWT)
curl -X GET http://localhost:8080/api/accounts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Key Differences: Next.js vs Spring Boot

| Aspect | Next.js | Spring Boot |
|--------|---------|-------------|
| **Language** | TypeScript/JavaScript | Java |
| **Routing** | File-based (`app/api/`) | Annotation-based (`@RequestMapping`) |
| **DI** | Manual imports | `@Autowired` / Constructor injection |
| **ORM** | Prisma / Raw SQL | JPA / Hibernate |
| **Server** | Node.js | Embedded Tomcat |
| **Hot Reload** | Fast Refresh | Spring DevTools |
| **Build** | npm/yarn | Maven/Gradle |

## Environment Setup

### Required Tools

1. **Java Development Kit (JDK) 17+**
   - Download from Oracle or use OpenJDK
   - Set `JAVA_HOME` environment variable

2. **Maven**
   - Comes with most IDEs
   - Or download from Apache Maven

3. **IDE Recommendations**
   - IntelliJ IDEA (Ultimate or Community)
   - Eclipse with Spring Tools
   - VS Code with Java Extension Pack

### Configuration Files

1. **application.properties** - Main configuration
2. **pom.xml** - Dependencies and build
3. **database/schema.sql** - Database schema (unchanged)

## Deployment Options

### Production Deployment

1. **JAR Deployment**
```bash
mvn clean package
java -jar target/fintrackrx-1.0.0.jar
```

2. **Docker** (create Dockerfile)
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/fintrackrx-1.0.0.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```

3. **Cloud Platforms**
   - AWS Elastic Beanstalk
   - Google Cloud Run
   - Azure App Service
   - Heroku

## Performance Considerations

- **Connection Pooling**: Configure HikariCP in application.properties
- **Caching**: Add Spring Cache with Redis
- **Async Processing**: Use `@Async` for long-running tasks
- **Pagination**: Implement with Spring Data Pageable

## Security Best Practices

1. ✅ JWT tokens with expiration
2. ✅ Password hashing with BCrypt
3. ✅ CORS configuration
4. ⚠️ HTTPS in production (configure SSL)
5. ⚠️ Rate limiting (add Spring Cloud Gateway)
6. ⚠️ Input validation (add `@Valid` annotations)

## Next Steps

1. **Complete remaining controllers** (Transactions, Budget, Goals)
2. **Add comprehensive tests** (Unit + Integration)
3. **Implement 2FA completely**
4. **Add Swagger/OpenAPI documentation**
5. **Create separate frontend** (React recommended)
6. **Set up CI/CD pipeline**
7. **Add monitoring** (Spring Actuator + Prometheus)

## Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Security](https://spring.io/projects/spring-security)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [JWT.io](https://jwt.io)

## Questions?

Check the main README-SPRINGBOOT.md or open an issue on GitHub.
