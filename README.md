Full-Stack Educational ERP Platform (SaaS)

eduNest is a comprehensive, production-ready, multi-tenant Educational Enterprise Resource Planning (ERP) platform. Designed for schools and educational organizations, it digitizes and streamlines the entire academic, administrative, financial, and human resources workflow.

Key Features & Modules by Role

1. Super Admin Portal (Platform Oversight)
* Organizations Management: Onboard and manage multiple tenant schools.
* Subscriptions: Track and manage SaaS subscriptions for organizations.
* Global Support: Respond to support tickets raised by organizations.
* Notifications: Platform-wide alerts and automated subscription expiry notifications.

2. Organization / Tenant Portal (School-wide Management)
* Branch Management: Manage multiple school branches.
* Staff & Student Oversight: High-level management of all enrolled students and hired staff.
* Academic Setup: Define core academic structures (Grades, Branches).
* Support Ticketing: Submit and track issues with platform support (Super Admin).

3. Administration Portal (Daily Operations)
* Admissions Management: Streamline new student enrollments.
* Fee Collection & Tracking: Manage student fee structures, generate invoices, and track payments.
* Schedule Management: Centralized control over Tutor and Student schedules/timetables.
* Exam Management: Create and publish Exam Routines.
* Inventory Management: Track school physical assets and materials.

4. HR Portal (Human Resources & Payroll)
* Staff Directory: Comprehensive database of all employees.
* Attendance Tracking: Monitor staff attendance.
* Payroll Processing: Generate and manage staff salaries and payroll logs.
* Document Management: Securely store and manage sensitive staff documents.

5. Tutor Portal (Academic Delivery)
* Classroom Management: Centralized dashboard for managing assigned classes.
* Attendance & Behavior: Track daily student attendance and log behavioral records.
* Assignments & Grading: Create, distribute, collect, and grade student assignments.
* Exams & Results: Publish grades and student result reports.
* Communication: Internal messaging system (Chat) to interact with students.
* Timetable: View scheduled classes.

6. Student Portal (Learning & Self-Service)
* Academic Dashboard: View enrolled courses, upcoming assignments, and exam schedules.
* Financial Hub: View outstanding fees and make direct online payments (eSewa).
* Library Management: Track borrowed books and library inventory.
* Internal Chat: Communicate securely with assigned tutors.
* Submissions: Upload assignment deliverables.

Payment & Financial Integrations
* Institutional Subscriptions (Stripe): Organizations can manage and upgrade their ERP SaaS subscriptions using Stripe.
* Student Fee Payments (eSewa ePay v2): Localized payment gateway integration allowing students to pay tuition online. Includes robust HMAC-SHA256 signature verification.

Automated Document & Notification Systems
* Real-time PDF Generation: Uses PDFKit for automated invoice, fee record, and receipt generation.
* Email Automation: Nodemailer integration for critical alerts (e.g., password resets, ticket updates).
* Bidirectional Ticketing: Real-time status updates on support issues between tenants and Super Admins.

UI/UX Highlights
* Clean, non-italicized, premium responsive design utilizing Tailwind CSS.
* Fluid animations and page transitions powered by Framer Motion.
* Toast notifications via React Hot Toast for instant feedback.
* Modular, accessible component architecture.

Tech Stack
Frontend
* Framework: React with Vite (TypeScript)
* Routing: React Router DOM
* Styling & UI: Tailwind CSS, Lucide React, Framer Motion
* State & Data Fetching: Context API, Axios

Backend & Database
* Runtime & Framework: Node.js, Express.js (TypeScript)
* Database: MongoDB with Mongoose ODM
* Authentication: JSON Web Tokens (JWT) & bcryptjs
* File Management: Multer for secure file uploads

Third-Party Utilities & Integrations
* Stripe (International Payments)
* eSewa (Nepalese Local Payments)
* Nodemailer (SMTP Emails)
* PDFKit (Document Generation)

Technical Highlights
* Multi-Tenant Architecture: Designed a highly scalable backend ensuring strict data isolation across different school organizations.
* Type Safety: End-to-end type safety using TypeScript, reducing runtime errors and improving maintainability.
* Secure Payment Workflows: Implemented strict webhook/verification middleware for both Stripe and eSewa to prevent transaction fraud and ensure seamless data synchronization.
