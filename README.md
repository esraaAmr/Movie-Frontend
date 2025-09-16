# 🎬 Movie Management System – Frontend

A responsive Angular application for managing movies with user authentication, admin dashboard, and real-time notifications.

## 🚀 Tech Stack
- **Framework**: Angular 18.2.0 (TypeScript 5.4.0)
- **Port**: 4200
- **Backend**: [Movie-Backend](https://github.com/esraaAmr/Movie-Backend)

---

## ✨ Features
- User authentication (Login/Logout)
- Admin dashboard for movie CRUD operations
- User dashboard to view movies
- Real-time notifications
- Confirmation dialogs
- Responsive design

---

## 🏗️ Project Structure
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

---

## 🔧 Configuration
Update the API URL in `src/environments/environment.ts` if needed:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8081'  // Backend API URL
};
```

---

## 🛠️ Installation & Setup

### 1️⃣ Clone the Frontend Repository
```bash
git clone https://github.com/esraaAmr/Movie-Frontend.git
cd Movie-Frontend
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Start Development Server
Make sure the backend is running first:
```bash
ng serve
```

The app will be available at:
🔗 **http://localhost:4200**

---

## 🏃‍♂️ Quick Start

1. **Start PostgreSQL database**
2. **Start the backend**: [Movie-Backend](https://github.com/esraaAmr/Movie-Backend)
3. **Start the frontend** using `ng serve`

---

## 🧪 Testing

### Frontend Tests
```bash
ng test                    # Run unit tests
ng e2e                     # Run end-to-end tests
ng test --watch=false      # Run tests once
```

### Build for Production
```bash
ng build                   # Build for production
ng build --prod           # Build with production optimizations
```

---

## 📝 Available Scripts

```bash
ng serve              # Start development server
ng build              # Build for production
ng test               # Run unit tests
ng lint               # Run linting
ng generate component # Generate new component
ng generate service   # Generate new service
```