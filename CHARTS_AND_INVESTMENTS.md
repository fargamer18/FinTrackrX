# FinTrackrX - Charts & Investments Setup Guide

## 🎉 New Features Added!

### 📊 Financial Charts
- **Monthly Bar Chart**: Shows income vs expenses for the last 6 months
- **Category Pie Chart**: Breaks down current month expenses by category
- Both charts are responsive and support dark mode

### 📈 Investment Portfolio Tracker
- Add stocks/investments with symbol, quantity, and purchase price
- Track current value vs purchase price (P&L)
- Sync real-time prices from Finnhub API
- View portfolio summary with total gains/losses
- Delete investments from portfolio

## 🚀 Quick Start

### 1. Install Dependencies (Already Done ✅)
```bash
npm install --legacy-peer-deps
```

### 2. Get Finnhub API Key
1. Go to [https://finnhub.io](https://finnhub.io)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Free tier includes: **60 API calls/minute**

### 3. Configure Environment Variables
Create/Update `.env.local` file in the root directory:
```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fintrackrx

# JWT Secret (generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-here

# Resend Email Service
RESEND_API_KEY=re_your_resend_api_key
EMAIL_FROM=noreply@yourdomain.com

# Finnhub Stock Market API (NEW!)
FINNHUB_API_KEY=your_finnhub_api_key_here

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Update Database Schema
Run the updated schema to add the investments table:

**Option A - Docker (Recommended)**
```bash
docker exec -i fintrackrx-db psql -U postgres -d fintrackrx < database/schema.sql
```

**Option B - Direct PostgreSQL**
```bash
psql -U postgres -d fintrackrx < database/schema.sql
```

### 5. Start Development Server
```bash
npm run dev
```

## 📱 How to Use

### View Charts on Dashboard
1. Navigate to `/dashboard`
2. Charts will automatically display based on your transaction data
3. **Bar Chart** shows monthly income/expense trends
4. **Pie Chart** shows current month expense categories

### Manage Investments
1. Navigate to `/investments` from the navbar
2. Click **"Add Investment"** button
3. Enter stock details:
   - **Symbol**: Stock ticker (e.g., AAPL, TSLA, GOOGL)
   - **Quantity**: Number of shares
   - **Purchase Price**: Price per share when bought
   - **Purchase Date**: When you bought it
   - **Notes**: Optional notes
4. Click **"Sync Prices"** to update current prices from Finnhub API
5. View your portfolio summary showing:
   - Total Value
   - Total Cost
   - Total Gain/Loss
   - Return Percentage

## 🔥 New Files Created

### Components
- `components/charts/FinanceBarChart.tsx` - Monthly income/expense bar chart
- `components/charts/ExpensePieChart.tsx` - Category-wise expense pie chart

### API Routes
- `app/api/investments/route.ts` - List and create investments
- `app/api/investments/[id]/route.ts` - Get, update, delete specific investment
- `app/api/investments/sync-prices/route.ts` - Batch sync prices from Finnhub

### Pages
- `app/investments/page.tsx` - Investment portfolio dashboard

### Libraries
- `lib/finnhub.ts` - Finnhub API integration service

### Database
- Updated `database/schema.sql` with investments table

## 📦 Dependencies Added

```json
{
  "recharts": "^2.10.3",     // React charts library
  "date-fns": "^3.0.0"        // Date manipulation utilities
}
```

## 🎯 Features

### Charts
✅ Responsive design (mobile-friendly)
✅ Dark mode support
✅ Custom tooltips with formatted values
✅ Currency formatting (₹)
✅ Last 6 months trend analysis
✅ Category-wise breakdown

### Investments
✅ Real-time stock price fetching
✅ Portfolio performance tracking
✅ Gain/Loss calculation (absolute & percentage)
✅ Multi-currency support
✅ Company profile fetching
✅ Batch price sync (60 stocks per minute on free tier)
✅ CRUD operations (Create, Read, Update, Delete)

## 🔧 Troubleshooting

### Charts not showing?
- Ensure you have transaction data in the system
- Check browser console for errors
- Verify recharts and date-fns are installed

### Investments not syncing prices?
- Check if `FINNHUB_API_KEY` is set in `.env.local`
- Verify API key is valid at finnhub.io
- Free tier limit is 60 calls/minute
- Check network tab for API responses

### TypeScript errors in editor?
- Restart VS Code TypeScript server: `Ctrl+Shift+P` → "Restart TS Server"
- Run `npm install` again if needed

## 📊 Finnhub API Endpoints Used

- **Quote**: Current price, change, percent change
- **Profile**: Company name, exchange, currency
- **Search**: Find stocks by symbol/name
- **Candles**: Historical OHLCV data (for future chart features)
- **News**: Market and company news (available for future features)

## 🎨 Color Scheme

### Charts
- **Income**: Green (#10b981)
- **Expense**: Red (#ef4444)
- **Categories**: Blue, Red, Green, Amber, Purple, Pink, Teal, Orange

### Dark Mode
All components automatically adapt to system theme preference.

## 🚀 Next Steps

Want to add more features?
- [ ] Stock search with autocomplete
- [ ] Portfolio allocation pie chart
- [ ] Historical performance line charts
- [ ] Dividend tracking
- [ ] Real-time price updates with WebSocket
- [ ] Export to CSV/PDF
- [ ] Investment goals and targets
- [ ] Tax calculation helper

## 💡 Tips

1. **Add Sample Data**: Create some transactions to see charts populate
2. **Test with Popular Stocks**: AAPL, MSFT, GOOGL, TSLA have reliable data
3. **Sync Regularly**: Click "Sync Prices" daily to keep portfolio updated
4. **Mobile View**: Charts are responsive - test on mobile!

---

**Happy Tracking! 📈💰**

Need help? Check the main SETUP.md for database and deployment instructions.
