# Zerodha Risk Platform

A Next.js-based trading risk management platform with real-time monitoring, portfolio analysis, and risk controls.

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your settings

# Run Prisma migrations
npx prisma generate
npx prisma db push

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📦 Free Deployment (Vercel + GitHub)

Deploy for **$0/month** using Vercel with free database and Redis services.

### Quick Deploy

1. **Setup Free Services**
   - Database: [Supabase](https://supabase.com) (Free PostgreSQL)
   - Redis: [Upstash](https://upstash.com) (Free Redis)

2. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

3. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables (see below)
   - Deploy!

### Environment Variables

Add these in Vercel dashboard:

```bash
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
REDIS_URL=rediss://default:[PASSWORD]@[ENDPOINT].upstash.io:6379
JWT_SECRET=[generate with: openssl rand -base64 32]
NEXTAUTH_SECRET=[generate with: openssl rand -base64 32]
NEXTAUTH_URL=https://your-app.vercel.app
```

📖 **Full deployment guide**: See [VERCEL_DEPLOYMENT.md](../VERCEL_DEPLOYMENT.md)

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL (Prisma ORM)
- **Cache**: Redis
- **Styling**: Tailwind CSS + shadcn/ui
- **Auth**: NextAuth.js
- **Real-time**: WebSocket Server

## 📁 Project Structure

```
src/
├── app/              # Next.js app router pages
│   ├── api/         # API routes
│   ├── dashboard/   # Dashboard page
│   ├── analysis/    # Analysis page
│   └── settings/    # Settings page
├── components/      # React components
│   └── ui/         # shadcn/ui components
└── lib/            # Utilities and helpers
```

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npx prisma studio    # Open Prisma database GUI
```

## 📚 Documentation

- [API Documentation](../docs/API.md)
- [Architecture](../docs/ARCHITECTURE.md)
- [Design System](../docs/DESIGN_SYSTEM.md)
- [Testing Guide](../docs/TESTING.md)

## 🤝 Contributing

This is a private project. For questions or issues, contact the development team.

## 📄 License

Proprietary - All rights reserved

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
