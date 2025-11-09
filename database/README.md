# FinTrackrX Database Setup

## PostgreSQL Database Schema

This folder contains the database schema and migration files for FinTrackrX.

## Quick Start

### 1. Install PostgreSQL

Make sure PostgreSQL is installed on your system:
- **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
- **macOS**: `brew install postgresql`
- **Linux**: `sudo apt-get install postgresql`

### 2. Create Database

```bash
# Connect to PostgreSQL as superuser
psql -U postgres

# Create database
CREATE DATABASE fintrackrx;

# Connect to the database
\c fintrackrx

# Run the schema file
\i schema.sql
```

Or from command line:
```bash
# Create database
createdb fintrackrx

# Run schema
psql -U postgres -d fintrackrx -f schema.sql
```

### 3. Database Connection

Create a `.env.local` file in the project root with your database credentials:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/fintrackrx"
```

## Schema Overview

### Core Tables

- **users** - User accounts with authentication
- **accounts** - Bank accounts, credit cards, investment accounts
- **categories** - Transaction categories (income/expense)
- **transactions** - Financial transactions
- **budgets** - Budget tracking per category
- **goals** - Financial goals and targets
- **recurring_transactions** - Automated recurring transactions
- **insights** - AI-generated financial insights

### Features

- UUID primary keys for security
- Automatic `created_at` and `updated_at` timestamps
- Cascading deletes for data integrity
- Indexed foreign keys for performance
- Default system categories included
- Views for common queries (summaries, budget tracking)

## Environment Setup

### For Development

```bash
# Using Docker (recommended)
docker run --name fintrackrx-db \
  -e POSTGRES_DB=fintrackrx \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=yourpassword \
  -p 5432:5432 \
  -d postgres:16

# Run schema
docker exec -i fintrackrx-db psql -U postgres -d fintrackrx < database/schema.sql
```

### For Production

Use a managed PostgreSQL service:
- **Vercel Postgres** (recommended for Next.js)
- **Supabase**
- **Railway**
- **AWS RDS**
- **Azure Database for PostgreSQL**

## Next Steps

### Install Database Client

```bash
npm install pg
# or for Prisma ORM
npm install prisma @prisma/client
```

### Using with Next.js API Routes

Create `lib/db.ts`:
```typescript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;
```

## Maintenance

### Backup

```bash
pg_dump -U postgres fintrackrx > backup.sql
```

### Restore

```bash
psql -U postgres fintrackrx < backup.sql
```

### Reset Database

```bash
dropdb fintrackrx
createdb fintrackrx
psql -U postgres -d fintrackrx -f schema.sql
```
