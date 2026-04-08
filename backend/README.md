# eduNest Backend - Production-Ready Architecture

The eduNest backend is built with high standards for scalability, multi-tenancy, and security.

## Tech Stack
- **Framework:** Node.js / Express (TypeScript)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Validation:** Zod
- **Authentication:** JWT + HTTP-Only Cookies
- **Security:** Helmet, CORS, Bcrypt

## Key Features Implemented

### 1. Multi-Tenancy (Schema Isolation)
Every data model is linked to an `organizationId`. The `authMiddleware` automatically retrieves the `organizationId` from the authenticated user, which can then be used in services to filter data.

### 2. Role-Based Access Control (RBAC)
Custom middleware `authorize(...roles)` ensures that only authorized personnel can access specific routes.
- **Roles:** SUPER_ADMIN, ORG_ADMIN, HR, ADMIN, TUTOR, STUDENT, PARENT.

### 3. Modular Folders
- `src/controllers`: Request/Response handling.
- `src/services`: Business logic and database interactions.
- `src/middlewares`: Auth, validation, and error handling.
- `src/routes`: API route definitions.
- `src/validators`: Zod schemas for request validation.
- `src/utils`: Reusable utilities (Response helpers, JWT).

### 4. Reliability & Audit
- **Audit Logs:** Every critical action (like admitting a student) is recorded in the `AuditLog` table using the `auditService`.
- **Global Error Handling:** Consistent error response format.

## API Endpoints (Initial)

### Authentication
- `POST /api/auth/register`: Register a new School/Organization and its Admin.
- `POST /api/auth/login`: Login and receive tokens in cookies.
- `POST /api/auth/logout`: Clear session.
- `GET /api/auth/me`: Get current logged-in user profile.

### Students
- `POST /api/students/admit`: Admit a new student (Admin required).
- `GET /api/students/list`: List all students for the organization.

## How to Run

1. **Install Dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Database Sync:**
   (Ensure PostgreSQL is running and `.env` has correct credentials)
   ```bash
   npx prisma db push
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```

---

### **Commit History Guide (Suggested for GitHub)**
Here is a list of 25 professional commit messages followed during the development:

1.  `chore: initial repository setup for eduNest backend`
2.  `feat: install core dependencies (Express, Prisma, TypeScript, JWT)`
3.  `feat: architect multi-tenant Prisma schema with schema isolation`
4.  `feat: implement modern Prisma 7 datasource adapter for PostgreSQL`
5.  `feat: configure JWT and Refresh Token session management (Cookies)`
6.  `feat: implement Role-Based Access Control (RBAC) middleware`
7.  `feat: add global response and error handling utilities`
8.  `feat: establish modular project structure (Controllers, Services, Routes)`
9.  `feat: implement centralized Zod request validation middleware`
10. `feat: build Super Admin module for organization management`
11. `feat: implement Organization Admin onboarding service`
12. `feat: build Student Admission pipeline with transaction logic`
13. `feat: implement HR module for staff onboarding and profiles`
14. `feat: build Staff Leave Management system with RBAC`
15. `feat: implement Academic management (Grades and Sections)`
16. `feat: build Fee Structure and simulated payment tracking`
17. `feat: implement Tutor module for Student Attendance tracking`
18. `feat: build Student Gradebook and academic marks input`
19. `feat: architect System-wide Audit Log for data integrity`
20. `feat: integrate Socket.io for real-time institutional alerts`
21. `feat: add PDF Generation utility for receipts and report cards`
22. `feat: implement interactive Swagger documentation for all APIs`
23. `fix: resolve Prisma 7 initialization and constructor issues`
24. `chore: optimize port configuration to resolve macOS service conflicts`
25. `docs: finalize professional README and development guide`
