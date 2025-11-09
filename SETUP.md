# FinTrackrX - Production Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies

```powershell
Set-Location D:\FullStackDev\fintrackrx
npm install --legacy-peer-deps
```

### 2. Set Up PostgreSQL Database

#### Option A: Using Docker (Recommended)

```powershell
# Start PostgreSQL container
docker run --name fintrackrx-db `
  -e POSTGRES_DB=fintrackrx `
  -e POSTGRES_PASSWORD=yourpassword `
  -p 5432:5432 `
  -d postgres:16

# Wait a few seconds, then run the schema
docker exec -i fintrackrx-db psql -U postgres -d fintrackrx < database/schema.sql

# Optional: Add sample data
docker exec -i fintrackrx-db psql -U postgres -d fintrackrx < database/sample-data.sql
```

#### Option B: Local PostgreSQL

```powershell
# Create database
createdb fintrackrx

# Run schema
psql -U postgres -d fintrackrx -f database/schema.sql
```

### 3. Configure Environment Variables

```powershell
# Copy example env file
Copy-Item .env.example .env.local

# Edit .env.local with your values
```

Required environment variables:
```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/fintrackrx"
JWT_SECRET="generate-a-strong-random-secret"
RESEND_API_KEY="your-resend-api-key"
EMAIL_FROM="FinTrackrX <noreply@yourdomain.com>"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Set Up Email Service (Resend)

1. Go to [resend.com](https://resend.com) and sign up
2. Verify your domain (or use their test domain for development)
3. Get your API key from the dashboard
4. Add it to `.env.local` as `RESEND_API_KEY`

For development, you can use Resend's test email: `delivered@resend.dev`

### 5. Generate JWT Secret

```powershell
# Generate a random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Add the output to `.env.local` as `JWT_SECRET`

### 6. Start the Development Server

```powershell
npm run dev
```

Visit `http://localhost:3000`

## 📧 Email Features

The app now sends emails for:

1. **Email Verification** - When users sign up
2. **Password Reset** - When users request password reset
3. **Transaction Alerts** - When large transactions are recorded
4. **Budget Alerts** - When budgets reach 75%, 90%, or 100%

## 🔐 Authentication Flow

### Sign Up
1. User submits name, email, password
2. Password is hashed with bcrypt
3. User record is created in database
4. Verification email is sent
5. JWT token is returned (user can login immediately)

### Email Verification
1. User clicks link in verification email
2. Token is validated against database
3. User is marked as verified
4. Token is deleted

### Login
1. User submits email, password
2. Password is verified against hash
3. JWT token is generated and returned
4. Last login timestamp is updated

### Password Reset
1. User requests password reset
2. Reset email is sent with secure token
3. User clicks link and enters new password
4. Password is hashed and updated
5. Token is deleted

## 🔧 API Routes

All API routes are in `app/api/`:

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login
- `GET /api/auth/verify-email?token=xxx` - Verify email
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Usage Example

```typescript
// Signup
const response = await fetch('/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'SecurePass123'
  })
});

const data = await response.json();
// Store data.token in localStorage or cookie
```

## 🗄️ Database Schema

The database includes:
- `users` - User accounts with hashed passwords
- `verification_tokens` - Email verification and password reset tokens
- `accounts` - Bank accounts, credit cards
- `categories` - Transaction categories
- `transactions` - Financial transactions
- `budgets` - Budget tracking
- `goals` - Financial goals
- `recurring_transactions` - Automated transactions
- `insights` - AI-generated insights

## 🧪 Testing

```powershell
# Run tests
npm test

# TypeScript check
npx tsc --noEmit
```

## 🚢 Deployment

### Recommended Stack
- **Frontend/Backend**: Vercel
- **Database**: Vercel Postgres or Supabase
- **Email**: Resend

### Deploy to Vercel

```powershell
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

### Environment Variables for Production

```env
DATABASE_URL="your-production-database-url"
JWT_SECRET="your-production-jwt-secret"
RESEND_API_KEY="your-resend-api-key"
EMAIL_FROM="FinTrackrX <noreply@yourdomain.com>"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

## 📊 Database Migrations

When updating the schema:

```powershell
# Backup first
pg_dump -U postgres fintrackrx > backup.sql

# Apply new schema changes
psql -U postgres -d fintrackrx -f database/migrations/001_add_new_column.sql
```

## 🔒 Security Notes

1. **Never commit `.env.local`** - It's in `.gitignore`
2. **Use strong JWT secrets** in production
3. **Enable HTTPS** in production
4. **Rate limit** authentication endpoints
5. **Verify email ownership** before password reset
6. **Hash all passwords** with bcrypt (minimum 10 rounds)
7. **Use prepared statements** for all SQL queries (already done with pg)

## 🐛 Troubleshooting

### Database Connection Issues
```powershell
# Test database connection
psql $env:DATABASE_URL
```

### Email Not Sending
- Check Resend API key is correct
- Verify domain is verified in Resend
- Check Resend logs in dashboard
- Use test email `delivered@resend.dev` for development

### TypeScript Errors
```powershell
# Restart TS server in VS Code
Ctrl+Shift+P -> "TypeScript: Restart TS Server"

# Or reload window
Ctrl+Shift+P -> "Developer: Reload Window"
```

## 📝 Next Steps

1. ✅ Install dependencies
2. ✅ Set up database
3. ✅ Configure environment variables
4. ✅ Set up Resend account
5. ✅ Test signup flow
6. ✅ Test email verification
7. ✅ Test password reset
8. 🔄 Update frontend to use real API routes
9. 🔄 Add middleware for protected routes
10. 🔄 Deploy to production

## 🤝 Support

For issues or questions, refer to:
- [Next.js Docs](https://nextjs.org/docs)
- [Resend Docs](https://resend.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
