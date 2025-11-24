# 🕌 Dashboard Masjid Syamsul 'Ulum - Backend

Professional Backend API dengan MVC Architecture untuk sistem manajemen keuangan Masjid Syamsul 'Ulum Telkom University.

## 📋 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: MySQL / PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js + JWT
- **Architecture**: MVC Pattern
- **Validation**: Zod
- **Logging**: Winston

## 🏗️ Architecture

```
Backend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes (Controllers)
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── controllers/           # Request Handlers
│   ├── services/              # Business Logic Layer
│   ├── repositories/          # Data Access Layer
│   ├── models/                # Data Models & Types
│   ├── middleware/            # Custom Middleware
│   ├── lib/                   # External Libraries Setup
│   ├── config/                # Configuration Files
│   ├── types/                 # TypeScript Type Definitions
│   └── utils/                 # Utility Functions
├── prisma/
│   ├── schema.prisma          # Database Schema
│   └── migrations/            # Database Migrations
└── public/
    └── uploads/               # File Uploads
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.17.0
- npm >= 9.0.0
- MySQL 8.0+ atau PostgreSQL 14+

### Installation

1. Clone repository

```bash
git clone https://github.com/karuqii9704/protein_RADAR.git
cd protein_RADAR/Backend
```

2. Install dependencies

```bash
npm install
```

3. Setup environment variables

```bash
cp .env.example .env
# Edit .env dengan konfigurasi Anda
```

4. Setup database

```bash
# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate

# (Optional) Seed sample data
npm run db:seed
```

5. Run development server

```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000`

## 📜 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking

# Database commands
npm run db:generate  # Generate Prisma Client
npm run db:push      # Push schema to database (dev)
npm run db:migrate   # Create and run migrations
npm run db:studio    # Open Prisma Studio GUI
npm run db:seed      # Seed database with sample data

# Testing
npm run test         # Run tests
npm run test:ui      # Run tests with UI
```

## 🔐 Environment Variables

Lihat `.env.example` untuk daftar lengkap environment variables yang diperlukan.

### Essential Variables:

- `DATABASE_URL`: Connection string database
- `NEXTAUTH_SECRET`: Secret key untuk NextAuth
- `JWT_SECRET`: Secret key untuk JWT

## 📡 API Documentation

### Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

### Endpoints (Coming Soon)

#### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

#### Incomes

- `GET /api/incomes` - List all incomes
- `GET /api/incomes/:id` - Get income detail
- `POST /api/incomes` - Create income
- `PUT /api/incomes/:id` - Update income
- `DELETE /api/incomes/:id` - Delete income

#### Expenses

- `GET /api/expenses` - List all expenses
- `GET /api/expenses/:id` - Get expense detail
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

#### Reports

- `GET /api/reports/summary` - Get financial summary
- `GET /api/reports/weekly` - Get weekly report
- `GET /api/reports/monthly` - Get monthly report
- `GET /api/reports/export` - Export report (PDF/Excel)

## 🏛️ MVC Pattern Implementation

### Model Layer (`/repositories`)

- Data access dan database queries
- Menggunakan Prisma ORM
- Pure data operations

### Service Layer (`/services`)

- Business logic
- Data validation
- Error handling
- Pure TypeScript functions

### Controller Layer (`/app/api`)

- Request/Response handling
- Input validation
- Memanggil services
- Return API responses

## 👥 Team

- **Ketua**: Rifqi Sigwan Nugraha (1303223004)
- **Anggota 1**: Davin Verrellius (1303223031)
- **Anggota 2**: Aldi Satria Hidayatullah (1303223056)
- **Anggota 3**: Anju Manginar Angelo Sitanggang (1303223065)
- **Anggota 4**: Rama Aulia Ramadan

## 📄 License

MIT License - Telkom University 2025
