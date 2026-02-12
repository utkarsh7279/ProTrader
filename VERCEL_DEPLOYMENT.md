# Vercel Deployment Guide (100% Free)

Deploy your trading platform using Vercel + GitHub with free database and Redis services.

## 🎯 Quick Start (3 Steps)

### Step 1: Setup Free Database (Supabase)

1. Go to [supabase.com](https://supabase.com) and create account
2. Click "New Project"
3. Choose a name and strong password
4. Wait 2 minutes for setup to complete

**Find Your Connection String:**
1. In Supabase dashboard, left sidebar → **Settings** ⚙️
2. Click **Database** tab
3. Scroll down to **Connection string** section
4. Click **URI** tab (important - not "Connection parameters")
5. Copy the full connection string that starts with `postgresql://`

**Format the Connection String:**
- The string looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?schema=public`
- Replace `[YOUR-PASSWORD]` with your actual database password (you set this when creating the project)
- Full example: `postgresql://postgres:MyPassword123@db.abcdefgh.supabase.co:5432/postgres?schema=public`

Save this as your `DATABASE_URL` environment variable.

### Step 2: Setup Free Redis (Upstash)

1. Go to [upstash.com](https://upstash.com) and create account
2. Click "Create Database"
3. Choose a name and region closest to you
4. Select **Free** tier
5. Copy the **REDIS_URL** from dashboard
   ```
   rediss://default:[PASSWORD]@[ENDPOINT].upstash.io:6379
   ```

### Step 3: Deploy to Vercel

1. **Push your code to GitHub**
   ```bash
   cd /Users/utkarshraj/zerodha-risk-platform/trading-platform-nextjs
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Add Environment Variables** (in Vercel dashboard)
   ```bash
   DATABASE_URL = postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
   REDIS_URL = rediss://default:[PASSWORD]@[ENDPOINT].upstash.io:6379
   JWT_SECRET = [generate random string]
   NEXTAUTH_SECRET = [generate random string]
   NEXTAUTH_URL = https://your-app.vercel.app
   ```

   **Generate secrets on your computer:**
   ```bash
   # Run this to generate random secrets
   openssl rand -base64 32
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app is live! 🎉

## 🔧 Environment Variables

Add these in Vercel dashboard (Settings → Environment Variables):

| Variable | Value | Where to Get |
|----------|-------|--------------|
| `DATABASE_URL` | `postgresql://...` | Supabase → Settings → Database |
| `REDIS_URL` | `rediss://...` | Upstash → Database → Details |
| `JWT_SECRET` | Random string | Generate with `openssl rand -base64 32` |
| `NEXTAUTH_SECRET` | Random string | Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | Your Vercel deployment URL |

## 📊 Run Database Migrations

After first deployment, run migrations:

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Link your project:
   ```bash
   cd trading-platform-nextjs
   vercel link
   ```

3. Pull environment variables:
   ```bash
   vercel env pull .env.local
   ```

4. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

## ⚡ Auto-Deploy on Git Push

Once connected, Vercel automatically deploys when you push to GitHub:

```bash
git add .
git commit -m "Update feature"
git push origin main
# Vercel automatically deploys! ✨
```

## 💰 Cost Breakdown

| Service | Free Tier | Limits |
|---------|-----------|--------|
| **Vercel** | Unlimited deployments | 100GB bandwidth/month |
| **Supabase** | Free PostgreSQL | 500MB database, 2GB bandwidth |
| **Upstash** | Free Redis | 10,000 commands/day |
| **Total** | **$0/month** | Perfect for development & testing |

## 🚀 Performance Tips

1. **Enable Caching**
   - Vercel automatically caches static assets
   - Uses Edge Network for global distribution

2. **Database Connection Pooling** (already configured in your code)
   - Supabase provides built-in connection pooling
   - Use `?pgbouncer=true` in connection string for serverless

3. **Redis for Session Storage**
   - Already configured in your app
   - Upstash has global replication

## ⚠️ Important Notes

### Custom WebSocket Server
Your app uses a custom WebSocket server (`server.js`). Vercel **does not support** custom servers in production.

**Solutions:**

1. **Use Vercel's API Routes** (Recommended for Vercel)
   - Remove WebSocket dependency
   - Use HTTP polling or Server-Sent Events
   - Already works with your existing API routes

2. **Deploy WebSocket Server Separately**
   - Keep Next.js on Vercel
   - Deploy WebSocket server to [Render](https://render.com) (free tier)
   - Update WebSocket URL in frontend

3. **Alternative: Use Railway for Full Support**
   - Railway supports custom servers
   - Includes PostgreSQL + Redis
   - $5 free credit/month

### For This Project
Since you have `server.js`, either:
- Remove WebSocket features and use Vercel's API routes only
- OR keep WebSocket and deploy to Railway instead

## 🔍 Troubleshooting

### Build Fails
```bash
# Check build logs in Vercel dashboard
# Common fix: ensure all dependencies in package.json
npm install
```

### Database Connection Error
```bash
# Test locally first
npx prisma db push
# Verify DATABASE_URL in Vercel environment variables
```

### Redis Connection Error
```bash
# Test connection
redis-cli -u $REDIS_URL ping
# Should return: PONG
```

## 📝 Quick Commands

```bash
# Local development
npm run dev

# Build locally (test before deploying)
npm run build

# Deploy manually
vercel --prod

# View logs
vercel logs

# Check deployment status
vercel ls
```

## 🎯 Next Steps

1. **Custom Domain** (Optional)
   - Vercel Settings → Domains
   - Add your domain
   - Free SSL certificate included

2. **Monitor Performance**
   - Vercel Analytics (free)
   - Supabase Dashboard
   - Upstash Metrics

3. **Set Up Git Workflow**
   - `main` branch = production deploy
   - Feature branches = preview deploys
   - Vercel creates preview URLs automatically

---

**Ready to deploy?** Follow the 3 steps above and you'll be live in 10 minutes! 🚀

For questions: [Vercel Discord](https://vercel.com/discord) | [Supabase Discord](https://discord.supabase.com)
