# 🔍 Finding Your Database Credentials

Complete visual guide to get `DATABASE_URL` and `REDIS_URL`.

---

## 📊 Supabase - Get DATABASE_URL

### Step-by-Step

1. **Sign up and create project**
   - Go to [supabase.com](https://supabase.com)
   - Click **"New project"**
   - Enter project name (e.g., "trading-platform")
   - Set a strong database password (you'll need this!)
   - Click **"Create new project"**
   - ⏳ Wait 2 minutes while it sets up

2. **Open Settings**
   - Once your project is ready, look at the **left sidebar**
   - Scroll to the bottom
   - Click **⚙️ Settings** (gear icon)

3. **Navigate to Database Settings**
   - In Settings, click the **"Database"** tab (top menu)
   - You should see database name, host, port info

4. **Get Connection String**
   - **Scroll down** in the Database page
   - Find section labeled **"Connection string"**
   - Click the **"URI"** tab (NOT "Connection parameters")
   - You'll see a long string starting with `postgresql://`
   - Click the **📋 copy button** next to it

5. **Replace Password**
   - The string shows `[YOUR-PASSWORD]` placeholder
   - Look at the copied string
   - Find `postgresql://postgres:PASSWORD@...`
   - Make sure you have your actual password there
   - If not, replace `[YOUR-PASSWORD]` with the database password you set

### Example
```
Original:   postgresql://postgres:[YOUR-PASSWORD]@db.abcxyzdef.supabase.co:5432/postgres?schema=public

Your copy:  postgresql://postgres:MySecurePass123@db.abcxyzdef.supabase.co:5432/postgres?schema=public
```

**Save this as: `DATABASE_URL`**

---

## 🔴 Upstash - Get REDIS_URL

### Step-by-Step

1. **Sign up**
   - Go to [upstash.com](https://upstash.com)
   - Click **"Sign Up"** (free tier available)
   - Complete signup

2. **Create Redis Database**
   - Click **"Create Database"** button
   - Choose a name (e.g., "trading-redis")
   - Select region closest to you
   - **Important**: Select **"Free"** tier
   - Click **"Create"**

3. **Get Redis URL**
   - After creation, your database appears in dashboard
   - Click on your database name
   - You should see **"REDIS_URL"** prominently displayed
   - Click the **📋 copy button** next to it
   - The URL looks like: `rediss://default:PASSWORD@ENDPOINT.upstash.io:6379`

4. **Verify You Have Everything**
   - URL should start with `rediss://` (not `redis://`)
   - Contains a password after `default:`
   - Contains the endpoint domain (`.upstash.io`)
   - Ends with `:6379` (the port)

### Example
```
rediss://default:AXXxxxxxxxxxxxxxxxxxxxxxxx@us1-sunny-panda-12345.upstash.io:6379
```

**Save this as: `REDIS_URL`**

---

## ✅ Verify Your Credentials

### Test DATABASE_URL
```bash
# Install PostgreSQL client (macOS)
brew install postgresql

# Test connection (paste your DATABASE_URL)
psql "postgresql://postgres:MyPassword@db.abcxyz.supabase.co:5432/postgres?schema=public"
# Should connect without error. Type \q to exit.
```

### Test REDIS_URL
```bash
# Install Redis CLI (macOS)
brew install redis

# Test connection (paste your REDIS_URL)
redis-cli -u "rediss://default:PASSWORD@endpoint.upstash.io:6379" ping
# Should return: PONG
```

---

## 🔐 Securely Add to Vercel

### In Vercel Dashboard:

1. Go to your project
2. Click **"Settings"** → **"Environment Variables"**
3. Add each variable:

| Name | Value |
|------|-------|
| `DATABASE_URL` | Paste Supabase connection string |
| `REDIS_URL` | Paste Upstash Redis URL |
| `JWT_SECRET` | Generate: `openssl rand -base64 32` |
| `NEXTAUTH_SECRET` | Generate: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` |

4. Click **"Save"** and redeploy your app

---

## ⚠️ Troubleshooting

### "Can't find Connection string in Supabase"
- Make sure you're in **Settings** (not Overview)
- Look for **"Database"** tab in Settings
- Scroll down - it's below the database info
- Click the **"URI"** tab, not "Connection parameters"

### "REDIS_URL has wrong format"
- Should start with `rediss://` (with two s's)
- Should contain `default:PASSWORD@`
- If you see `redis://`, that's HTTP (wrong for Vercel)
- Upstash free tier uses `rediss://`

### "Connection failed error"
- Check password is correctly filled in (not `[YOUR-PASSWORD]`)
- Make sure no extra spaces in the URL
- Verify database/Redis is active in their dashboards

### "Still can't find it?"
- Supabase might have updated their UI
- Try: In Supabase → Project Settings (left menu) → Database
- Look for "Connection pooler" or "Direct connection" sections
- We need the one that works with serverless (usually "Direct connection")

---

📖 Once you have both URLs, follow [QUICKSTART.md](QUICKSTART.md) to deploy!
