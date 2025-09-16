# Movie Management System

A full-stack web application for managing movies with user authentication, admin dashboard, and movie CRUD operations.

## 🏗️ Project Architecture

This project consists of two main components:

### Frontend (Angular 18.2.0)
- **Location**: `Movie-Frontend/`
- **Framework**: Angular 18.2.0 with TypeScript 5.4.0
- **Port**: 4200
- **Features**: 
  - User authentication (Login/Logout)
  - Admin dashboard for movie management
  - User dashboard for viewing movies
  - Real-time notifications
  - Confirmation dialogs
  - Responsive design

### Backend (Spring Boot 3.5.5)
- **Location**: `Movie-Backend/`
- **Framework**: Spring Boot 3.5.5 with Java 17
- **Port**: 8081
- **Database**: PostgreSQL (Port 5433)
- **Features**:
  - RESTful API endpoints
  - JPA/Hibernate for data persistence
  - Liquibase for database migrations
  - Swagger UI documentation
  - OMDB API integration

## 🚀 Prerequisites

Before running the project, ensure you have the following installed:

### Required Software
- **Java 17** or higher
- **Node.js 18** or higher
- **npm** (comes with Node.js)
- **Angular CLI 18.2.0**
- **PostgreSQL 12** or higher
- **Maven 3.6** or higher

### Database Setup
1. Install PostgreSQL
2. Create a database named `moviedb`
3. Update database credentials in `Movie-Backend/src/main/resources/application.properties` if needed:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5433/moviedb
   spring.datasource.username=postgres
   spring.datasource.password=password
   ```

## 📦 Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd <repository-name>
```

### 2. Backend Setup (Run First)
```bash
# Navigate to backend directory
cd Movie-Backend

# Install dependencies (if needed)
mvn clean install

# Run the Spring Boot application
mvn spring-boot:run
```

**Backend will be available at**: `http://localhost:8081`
**API Documentation**: `http://localhost:8081/docs`

### 3. Frontend Setup (Run After Backend)
```bash
# Navigate to frontend directory
cd Movie-Frontend

# Install dependencies
npm install

# Start the development server
ng serve
```

**Frontend will be available at**: `http://localhost:4200`

## 🏃‍♂️ Quick Start

### Step-by-Step Running Instructions

1. **Start PostgreSQL Database**
   - Ensure PostgreSQL is running on port 5433
   - Database `moviedb` should exist

2. **Start Backend First** ⚠️ **IMPORTANT**
   ```bash
   cd Movie-Backend
   mvn spring-boot:run
   ```
   - Wait for "Started MovieApplication" message
   - Backend API will be available at `http://localhost:8081`

3. **Start Frontend Second**
   ```bash
   cd Movie-Frontend
   ng serve
   ```
   - Frontend will be available at `http://localhost:4200`
   - The app will automatically open in your browser

## 🛠️ Development

### Frontend Development
```bash
cd Movie-Frontend

# Install dependencies
npm install

# Start development server
ng serve

# Build for production
ng build

# Run tests
ng test

# Run linting
ng lint
```

### Backend Development
```bash
cd Movie-Backend

# Clean and compile
mvn clean compile

# Run tests
mvn test

# Package application
mvn package

# Run with specific profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

## 📁 Project Structure

### Frontend Structure
```
Movie-Frontend/
├── src/
│   ├── app/
│   │   ├── core/                    # Core services and guards
│   │   │   ├── guards/             # Route guards
│   │   │   └── services/           # Core services (API, Auth, HTTP)
│   │   ├── features/               # Feature modules
│   │   │   ├── auth/               # Authentication feature
│   │   │   │   └── components/
│   │   │   │       └── login/      # Login component
│   │   │   ├── admin/              # Admin feature
│   │   │   │   └── components/
│   │   │   │       └── dashboard/  # Admin dashboard
│   │   │   └── user/               # User feature
│   │   │       └── components/
│   │   │           └── dashboard/  # User dashboard
│   │   ├── shared/                 # Shared components and services
│   │   │   ├── components/         # Reusable components
│   │   │   │   ├── dialog/         # Confirmation dialogs
│   │   │   │   ├── notification/   # Notification system
│   │   │   │   └── loading/        # Loading spinner
│   │   │   └── services/           # Shared services
│   │   ├── app.module.ts           # Main app module
│   │   └── app-routing.module.ts   # Main routing
│   ├── assets/                     # Static assets
│   └── environments/               # Environment configurations
├── package.json
└── angular.json
```

### Backend Structure
```
Movie-Backend/
├── src/
│   ├── main/
│   │   ├── java/com/example/movie/
│   │   │   ├── MovieApplication.java    # Main application class
│   │   │   ├── controller/              # REST controllers
│   │   │   ├── service/                 # Business logic
│   │   │   ├── repository/              # Data access layer
│   │   │   ├── entity/                  # JPA entities
│   │   │   └── dto/                     # Data transfer objects
│   │   └── resources/
│   │       ├── application.properties   # Configuration
│   │       └── db/changelog/            # Liquibase migrations
│   └── test/                            # Test files
├── pom.xml                             # Maven configuration
└── target/                             # Build output
```

## 🔧 Configuration

### Environment Variables

#### Frontend (`src/environments/environment.ts`)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8081'  // Backend API URL
};
```

#### Backend (`src/main/resources/application.properties`)
```properties
# Server Configuration
server.port=8081
spring.application.name=Movie

# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5433/moviedb
spring.datasource.username=postgres
spring.datasource.password=password

# API Configuration
omdb.api.key=50973610
omdb.api.url=https://www.omdbapi.com/

# Documentation
springdoc.swagger-ui.path=/docs
```

## 🎯 Features

### Authentication
- User login/logout
- Route guards for protected pages
- Session management

### Admin Dashboard
- Movie CRUD operations
- Batch import/export
- User management
- Real-time notifications

### User Dashboard
- View movie catalog
- Search and filter movies
- Responsive design

### Shared Components
- Confirmation dialogs
- Notification system
- Loading indicators

## 🧪 Testing

### Frontend Tests
```bash
cd Movie-Frontend
ng test                    # Run unit tests
ng e2e                     # Run end-to-end tests
ng test --watch=false      # Run tests once
```

### Backend Tests
```bash
cd Movie-Backend
mvn test                   # Run all tests
mvn test -Dtest=ClassName  # Run specific test class
```

## 📚 API Documentation

Once the backend is running, you can access the API documentation at:
- **Swagger UI**: `http://localhost:8081/docs`

## 🐛 Troubleshooting

### Common Issues

1. **Backend won't start**
   - Check if PostgreSQL is running
   - Verify database credentials
   - Ensure port 8081 is available

2. **Frontend can't connect to backend**
   - Ensure backend is running first
   - Check if API URL is correct in environment files
   - Verify CORS configuration

3. **Database connection issues**
   - Check PostgreSQL service status
   - Verify database exists
   - Check connection credentials

4. **Port conflicts**
   - Backend: Change port in `application.properties`
   - Frontend: Use `ng serve --port 4201`

## 📝 Available Scripts

### Frontend Scripts
```bash
ng serve              # Start development server
ng build              # Build for production
ng test               # Run unit tests
ng lint               # Run linting
ng generate component # Generate new component
ng generate service   # Generate new service
```

### Backend Scripts
```bash
mvn spring-boot:run   # Run application
mvn clean compile     # Clean and compile
mvn test             # Run tests
mvn package          # Create JAR file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions, please:
1. Check the troubleshooting section
2. Review the API documentation
3. Create an issue in the repository

---

**Note**: Always start the backend before the frontend to ensure proper API connectivity.