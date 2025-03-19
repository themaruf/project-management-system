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

### 2. Start MongoDB (in separate terminal):

```bash
mongod --dbpath="d:\data\db"
```


### 3. Setup and Run Backend 
```bash
cd backend
npm install
copy .env.example .env
npm start
````

### 4. Setup and Run Frontend
Open a new terminal
```bash
cd frontend
npm install
ng serve
```


## Access the Application

- Frontend: http://localhost:4200
- Backend API: http://localhost:3000/api

## General Troubleshooting

- CORS Errors : Ensure backend is running and .env CORS_ORIGIN matches frontend URL
- Database Issues : Verify MongoDB is running with mongod --version
- Installation Errors : Delete node_modules and run npm install again


## Troubleshooting Environment Configuration

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
