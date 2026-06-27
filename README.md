# Smart Attendance System with QR & GPS Verification 

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express-v4.19-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green.svg)](https://www.mongodb.com/)
[![Security](https://img.shields.io/badge/Security-Helmet%20%7C%20CORS%20%7C%20RateLimit-orange.svg)](#)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

An industry-grade, production-ready, backend-driven attendance management platform that prevents proxy attendance using secure **QR Code Authentication** and **GPS Geolocation Verification**. Designed to follow clean layered architecture, SOLID principles, and professional security frameworks.

---

##  System Architecture & Workflow

```mermaid
sequenceDiagram
    actor Admin/Teacher
    actor Student
    participant Backend as Express Backend
    participant DB as MongoDB
    
    Admin/Teacher->>Backend: POST /api/qr/create-session (subject, details, duration)
    Backend->>DB: Save session (token, expiresAt, active)
    Backend-->>Admin/Teacher: Return Session object & signed Base64 QR Image
    
    Note over Student, Backend: Student scans QR & grabs token via client application
    
    Student->>Backend: POST /api/attendance/mark (signed QR token)
    Backend->>Backend: Decode & verify token integrity (JWT validation)
    Backend->>Backend: Validate session expiry & status
    Backend->>DB: Query for duplicate scan logs
    Backend->>DB: Save Attendance log (status: Present)
    Backend-->>Student: Return Success Response
```

---

##  Technology Stack

* **Core Backend Framework**: Node.js & Express.js
* **Database & ODM**: MongoDB & Mongoose
* **Security & Auth**: JWT (JSON Web Tokens) & `bcryptjs`
* **QR Generation Engine**: `qrcode` base64 builder
* **Input Sanitization & Validation**: `express-validator`
* **Performance & Safety**: Helmet, CORS, and Express Rate Limiter
* **Audit & HTTP Logging**: Winston & Morgan logger

---

##  Project Structure

```text
src/
├── config/             # DB & Winston Logger configurations
├── constants/          # Application-wide roles & status states
├── controllers/        # Express Controllers (handles request parsing & API output)
├── database/           # Mongoose setup (mounted schemas)
├── docs/               # API collections (Postman/Swagger details)
├── middlewares/        # Authentication, Role RBAC, Validations & Global Error Handlers
├── models/             # Mongoose schemas (User, Attendance, QRSession)
├── repositories/       # Abstraction layer directly querying database models
├── routes/             # Express API routing tables
├── services/           # Core business logic layer
├── utils/              # Helper utilities (AppError classes)
├── validators/         # Input rules defined using express-validator
├── app.js              # Express app configs and routing tables
└── server.js           # Server runner and database connectivity
```

---

##  Environment Variables Configuration

Create a `.env` file in the root directory:

```env
# Server Configurations
PORT=5000
NODE_ENV=development

# Database Configurations
MONGODB_URI=mongodb://localhost:27017/smart-attendance

# JWT Authentication Secrets
JWT_SECRET=super_secret_jwt_sign_key_123456_change_in_production
JWT_EXPIRES_IN=1h

# QR Session Secret
QR_SECRET=qr_data_encryption_secret_phrase
```

---

##  Installation & Setup Guide

### 1. Prerequisites
* Install [Node.js](https://nodejs.org/) (v18+)
* Install and run [MongoDB](https://www.mongodb.com/) locally or setup a MongoDB Atlas cloud database.

### 2. Clone and Install Dependencies
```bash
git clone https://github.com/your-username/Smart-Attendance-System-with-QR-GPS-Verification.git
cd Smart-Attendance-System-with-QR-GPS-Verification
npm install
```

### 3. Run the Development Server
```bash
npm run dev
```
The server will boot up at `http://localhost:5000`. You can check server health at `http://localhost:5000/health`.

### 4. Running the Test Suite
The project uses Jest and Supertest with mock databases to run assertions without database dependencies:
```bash
npm run test
```

---

##  Database Schema Definitions

### 1. Users Schema
* `fullName` (String, required)
* `email` (String, required, unique, lowercased, indexed)
* `password` (String, required, hidden by default)
* `role` (String, Admin | Teacher | Student | Employee)
* `department` (String, required)
* `course` (String, required if Student)
* `semester` (Number, required if Student)
* `studentId` (String, unique, indexed, required if Student)
* `employeeId` (String, unique, indexed, required if staff)
* `isActive` (Boolean, default: true)
* Timestamps: `createdAt`, `updatedAt`

### 2. QRSession Schema
* `sessionName` (String, required)
* `subject` (String, required)
* `createdBy` (ObjectId, ref: User, required)
* `qrToken` (String, unique, indexed)
* `expiresAt` (Date, indexed)
* `isActive` (Boolean, default: true)
* Timestamps: `createdAt`, `updatedAt`

### 3. Attendance Schema
* `userId` (ObjectId, ref: User, required)
* `qrSessionId` (ObjectId, ref: QRSession, required)
* `attendanceStatus` (String: Present | Absent | Late | Excused, default: Present)
* `attendanceTime` (Date, default: Date.now)
* `date` (Date, indexed, hours zeroed-out)
* Unique index on compound key: `{ userId, qrSessionId }` (prevents double attendance)

---

##  REST API Endpoints Map

### Authentication APIs
* `POST /api/auth/register` - Create user account (returns token)
* `POST /api/auth/login` - Validate credentials (returns token + sets httpOnly cookie)
* `POST /api/auth/logout` - Clear cookies/tokens
* `GET /api/auth/profile` - Fetch current user profile (JWT protected)
* `PUT /api/auth/profile` - Update user profile attributes (JWT protected)

### QR Session APIs
* `POST /api/qr/create-session` - Start a QR Session (Teacher/Admin only)
* `GET /api/qr/active` - List active sessions (All users)
* `GET /api/qr/:id` - Fetch details of a session (All users)
* `DELETE /api/qr/:id` - Deactivate/Terminate session (Creator/Admin only)

### Attendance APIs
* `POST /api/attendance/mark` - Mark scanning presence (Student/Employee only, validates signed QR)
* `GET /api/attendance/history` - Fetch student's own attendance history (Student/Employee only)
* `GET /api/attendance/all` - List all marked logs (Teacher/Admin only, supports filter queries)
* `GET /api/attendance/:id` - Get specific log details (Auth users, checks authorization bounds)
* `PUT /api/attendance/:id` - Manual override status (Teacher/Admin only)
* `DELETE /api/attendance/:id` - Delete log record (Admin only)

---

##  Postman & Swagger Details
Import the prebuilt [Postman Collection](src/docs/postman_collection.json) to quickly interact with the endpoints. It contains templates for request payloads, variables, and automated tests.

---

##  Future Enhancements (Phase 2 & Beyond)
1. **GPS Radius Verification**: Validate that latitude/longitude is inside geofenced zones.
2. **Real-time Synchronization**: Push live scan events to the dashboard using Socket.io.
3. **Face Recognition integration**: Secondary biometric confirmation.
4. **Excel/PDF export engines**: Report builders for admin dashboards.

---

##  License
This project is licensed under the MIT License - see the LICENSE file for details.