# 🚀 3-Step Free Deployment

Deploy your trading platform to Vercel + GitHub for **$0/month**.

## Step 1️⃣: Free Database & Redis

**Having trouble finding credentials?** 👉 See [CREDENTIALS_GUIDE.md](CREDENTIALS_GUIDE.md) for detailed steps with examples.

### Supabase (PostgreSQL)
1. Go to [supabase.com](https://supabase.com) → Sign up (free)
2. Create new project → Wait 2 minutes
3. **Get Connection String**:
   - Left sidebar → Click **Settings** ⚙️
   - Click **Database** 
   - Scroll to **Connection string** section
   - Select **URI** tab (not Connection parameters)
   - Copy the full string (starts with `postgresql://`)
   - Replace `[YOUR-PASSWORD]` with your database password
4. Save full URL as `DATABASE_URL`
   - Example: `postgresql://postgres:mypassword@db.xxxxx.supabase.co:5432/postgres`

### Upstash (Redis)
1. Go to [upstash.com](https://upstash.com) → Sign up (free)
2. Create database → Choose free tier
3. Copy **REDIS_URL** from dashboard
4. Save it

## Step 2️⃣: Push to GitHub

```bash
cd /Users/utkarshraj/zerodha-risk-platform/trading-platform-nextjs

# Initialize git
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

## Step 3️⃣: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. Click **"New Project"** → Import your repo
3. Add environment variables:
   ```
   DATABASE_URL = [paste from Supabase]
   REDIS_URL = [paste from Upstash]
   JWT_SECRET = [run: openssl rand -base64 32]
   NEXTAUTH_SECRET = [run: openssl rand -base64 32]
   NEXTAUTH_URL = https://your-app.vercel.app
   ```
4. Click **"Deploy"** → Wait 3 minutes ✨

## ✅ You're Live!

Your app is now at: `https://your-app.vercel.app`

### Auto-Deploy
Every time you push to GitHub, Vercel automatically deploys:
```bash
git add .
git commit -m "Update feature"
git push
# Auto-deploys! 🎉
```

---

📖 **Detailed guide**: [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)  
🛠️ **Local dev setup**: [trading-platform-nextjs/README.md](trading-platform-nextjs/README.md)
