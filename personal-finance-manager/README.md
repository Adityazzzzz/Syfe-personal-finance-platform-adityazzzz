# Personal Finance Manager API

A comprehensive REST API for managing personal finances, built with Spring Boot 3.x and Java 17.

## Features

- **User Management & Authentication**: Register, login, logout with session-based authentication
- **Transaction Management**: Create, read, update, delete transactions with filtering
- **Category Management**: Default categories plus custom category creation
- **Savings Goals**: Set financial goals with automatic progress tracking
- **Reports & Analytics**: Monthly and yearly financial reports

## Technology Stack

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Security**
- **Spring Data JPA**
- **H2 Database** (in-memory)
- **Maven**
- **JUnit 5 & Mockito**

## API Endpoints
Run frontend - npm run dev
Run backend - export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64 && export PATH=$JAVA_HOME/bin:$PATH && mvn spring-boot:run

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |

### Transactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/transactions` | Create transaction |
| GET | `/api/transactions` | Get all transactions (supports filters) |
| PUT | `/api/transactions/{id}` | Update transaction |
| DELETE | `/api/transactions/{id}` | Delete transaction |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | Get all categories |
| POST | `/api/categories` | Create custom category |
| DELETE | `/api/categories/{name}` | Delete custom category |

### Goals
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/goals` | Create savings goal |
| GET | `/api/goals` | Get all goals |
| GET | `/api/goals/{id}` | Get specific goal |
| PUT | `/api/goals/{id}` | Update goal |
| DELETE | `/api/goals/{id}` | Delete goal |

### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports/monthly/{year}/{month}` | Get monthly report |
| GET | `/api/reports/yearly/{year}` | Get yearly report |

## Default Categories

### Income
- Salary

### Expense
- Food
- Rent
- Transportation
- Entertainment
- Healthcare
- Utilities

## Getting Started

### Prerequisites
- Java 17 or higher
- Maven 3.8+

### Running Locally

```bash
# Clone the repository
cd personal-finance-manager

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The API will be available at `http://localhost:8080`

H2 Console: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:financedb`
- Username: `sa`
- Password: (empty)

### Testing

```bash
# Run unit tests
mvn test

# Generate test coverage report
mvn jacoco:report
```

## Example Usage

### Register User
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "user@example.com",
    "password": "password123",
    "fullName": "John Doe",
    "phoneNumber": "+1234567890"
  }'
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "user@example.com",
    "password": "password123"
  }' \
  -c cookies.txt
```

### Create Transaction
```bash
curl -X POST http://localhost:8080/api/transactions \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "amount": 5000.00,
    "date": "2024-01-15",
    "category": "Salary",
    "description": "Monthly salary"
  }'
```

### Get Transactions
```bash
curl http://localhost:8080/api/transactions \
  -b cookies.txt
```

### Create Goal
```bash
curl -X POST http://localhost:8080/api/goals \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "goalName": "Emergency Fund",
    "targetAmount": 5000.00,
    "targetDate": "2026-01-01"
  }'
```

### Get Monthly Report
```bash
curl http://localhost:8080/api/reports/monthly/2024/1 \
  -b cookies.txt
```

## Architecture

The application follows a layered architecture:

- **Controller Layer**: REST API endpoints
- **Service Layer**: Business logic
- **Repository Layer**: Data access
- **Entity Layer**: JPA entities
- **DTO Layer**: Request/response objects

## Error Handling

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |

## Security

- Session-based authentication
- BCrypt password hashing
- Data isolation per user
- CSRF disabled for API usage

## License

MIT License
