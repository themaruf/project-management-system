````markdown
# Project Management System

A full-stack MEAN application for managing projects and tasks.

## Prerequisites

- Node.js v18+
- MongoDB Community Server 6.0+
- Angular CLI 17+

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/themaruf/project-management-system.git
cd project-management-system
```
````

````

### 2. Backend Setup
```bash
cd backend
npm install
copy .env.example .env
````

### 3. Frontend Setup

```bash
cd ..\frontend
npm install
```

## Running the Application

1. Start MongoDB (in separate terminal):

```bash
mongod --dbpath="d:\data\db"
```

2. Start Backend:

```bash
cd backend
npm start
```

3. Start Frontend:

```bash
cd ..\frontend
ng serve
```

## Environment Configuration

Backend ( .env ):

```ini
PORT=3000
CORS_ORIGIN=http://localhost:4200
MONGODB_URI=mongodb://localhost:27017/project_management
JWT_SECRET=your_secure_secret
```

````

Frontend ( src/environments/environment.ts ):

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
};
````

## Access the Application

- Frontend: http://localhost:4200
- Backend API: http://localhost:3000/api

## Default Credentials

```yaml
Email: test@example.com
Password: password123
```

## Troubleshooting

- CORS Errors : Ensure backend is running and .env CORS_ORIGIN matches frontend URL
- Database Issues : Verify MongoDB is running with mongod --version
- Installation Errors : Delete node_modules and run npm install again
