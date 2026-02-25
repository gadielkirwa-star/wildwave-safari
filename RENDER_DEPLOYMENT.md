# Wild Waves Safaris - Render Deployment Guide

## Prerequisites
- GitHub account
- Render account (free tier available at https://render.com)
- Git installed locally

## Step 1: Push Code to GitHub

```bash
cd /home/user/Public/wild-waves-safaris/savanna-vision-craft

# Initialize git if not already done
git init
git add .
git commit -m "Initial commit for Render deployment"

# Create repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/wild-waves-safaris.git
git branch -M main
git push -u origin main
```

## Step 2: Create PostgreSQL Database on Render

1. Go to https://dashboard.render.com
2. Click **New +** → **PostgreSQL**
3. Settings:
   - **Name**: `wildwave-safaris-db`
   - **Database**: `wildwave_safaris`
   - **User**: `wildwave_user`
   - **Region**: Choose closest to your users
   - **Plan**: Free (or paid for production)
4. Click **Create Database**
5. Wait for database to provision (2-3 minutes)
6. Copy the **Internal Database URL** (starts with `postgresql://`)

## Step 3: Import Database Schema

1. In your database dashboard, click **Connect** → **External Connection**
2. Copy the **PSQL Command**
3. Run locally:
```bash
# Download schema if needed
cd /home/user/Public/wild-waves-safaris/savanna-vision-craft

# Connect and import (replace with your PSQL command)
psql postgresql://wildwave_user:PASSWORD@HOST/wildwave_safaris < backend/schema.sql
```

Or use Render's web shell:
1. Click **Shell** tab in database dashboard
2. Paste schema.sql contents and execute

## Step 4: Deploy Backend API

1. Click **New +** → **Web Service**
2. Connect your GitHub repository
3. Settings:
   - **Name**: `wildwave-safaris-api`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
   - **Plan**: Free (or paid)

4. **Environment Variables** - Add these:
   ```
   NODE_ENV=production
   PORT=10000
   DATABASE_URL=[paste Internal Database URL from Step 2]
   JWT_SECRET=your_random_secret_key_here_change_this
   CORS_ORIGIN=https://wildwavesafaris.com,https://www.wildwavesafaris.com,https://wildwave-safaris.onrender.com,https://wildwave-safaris-admin.onrender.com
   ```

5. Click **Create Web Service**
6. Wait for deployment (3-5 minutes)
7. Copy your API URL (e.g., `https://wildwave-safaris-api.onrender.com`)

## Step 5: Update Frontend API URLs

Update all API calls to use your Render backend URL:

```bash
cd /home/user/Public/wild-waves-safaris/savanna-vision-craft

# Update these files with your Render API URL
# Replace http://localhost:5000 with https://wildwave-safaris-api.onrender.com
```

**Files to update:**
- `src/pages/Index.tsx`
- `src/pages/Destinations.tsx`
- `src/pages/Packages.tsx`
- `src/pages/Blog.tsx`
- `src/pages/Contact.tsx`
- `src/pages/Booking.tsx`
- `src/pages/Auth.tsx`
- `src/components/PromotionalPopup.tsx`
- `admin/src/lib/api.ts`

Example change:
```typescript
// Before
const API_URL = 'http://localhost:5000';

// After
const API_URL = 'https://wildwave-safaris-api.onrender.com';
```

## Step 6: Update Backend Database Config

Update `backend/src/db.js` to use Render's DATABASE_URL:

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;
```

Commit and push changes:
```bash
git add .
git commit -m "Configure for Render deployment"
git push
```

Backend will auto-redeploy on Render.

## Step 7: Deploy Frontend

1. Click **New +** → **Static Site**
2. Connect your GitHub repository
3. Settings:
   - **Name**: `wildwave-safaris`
   - **Branch**: `main`
   - **Root Directory**: (leave empty)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. Click **Create Static Site**
5. Wait for deployment (3-5 minutes)
6. Your frontend URL: `https://wildwave-safaris.onrender.com`

## Step 8: Deploy Admin Panel

1. Click **New +** → **Static Site**
2. Connect your GitHub repository
3. Settings:
   - **Name**: `wildwave-safaris-admin`
   - **Branch**: `main`
   - **Root Directory**: `admin`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. Click **Create Static Site**
5. Your admin URL: `https://wildwave-safaris-admin.onrender.com`

## Step 9: Configure Custom Domain (Optional)

### For Frontend:
1. Go to your frontend static site dashboard
2. Click **Settings** → **Custom Domain**
3. Add your domain: `www.wildwavesafaris.com`
4. Follow DNS instructions to add CNAME record

### For Backend API:
1. Go to your backend web service dashboard
2. Click **Settings** → **Custom Domain**
3. Add subdomain: `api.wildwavesafaris.com`
4. Add CNAME record in your DNS

## Step 10: Test Deployment

Visit your URLs:
- **Frontend**: https://wildwave-safaris.onrender.com
- **Admin**: https://wildwave-safaris-admin.onrender.com
- **API**: https://wildwave-safaris-api.onrender.com/api/public/destinations

### Test Checklist:
- [ ] Frontend loads correctly
- [ ] Destinations page shows data
- [ ] Packages page shows data
- [ ] Blog page shows posts
- [ ] Contact form submits
- [ ] Admin login works
- [ ] Booking form submits
- [ ] Customer signup/login works

## Important Notes

### Free Tier Limitations:
- Backend spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- Database limited to 90 days on free tier
- 750 hours/month free for web services

### Upgrade to Paid:
- Backend stays always active ($7/month)
- Database persists indefinitely ($7/month)
- Faster builds and deployments

## Environment Variables Reference

### Backend (.env or Render dashboard):
```
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://user:pass@host/db
JWT_SECRET=your_secret_key
```

## Monitoring and Logs

### View Backend Logs:
1. Go to backend web service dashboard
2. Click **Logs** tab
3. Real-time logs appear here

### View Database Logs:
1. Go to database dashboard
2. Click **Logs** tab

### Restart Services:
1. Go to service dashboard
2. Click **Manual Deploy** → **Clear build cache & deploy**

## Troubleshooting

### Backend Not Responding:
- Check logs in Render dashboard
- Verify DATABASE_URL is set correctly
- Ensure database is running
- Check if service is sleeping (free tier)

### Database Connection Error:
- Verify DATABASE_URL includes `?ssl=true`
- Check db.js has SSL configuration
- Ensure database is in same region as backend

### Frontend API Calls Failing:
- Check CORS settings in backend
- Verify API URL is correct in frontend files
- Check browser console for errors
- Ensure backend is deployed and running

### Build Failures:
- Check build logs in Render dashboard
- Verify package.json has correct scripts
- Ensure all dependencies are listed
- Check Node version compatibility

## Automatic Deployments

Render automatically deploys when you push to GitHub:

```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push

# Render automatically:
# 1. Detects push
# 2. Runs build
# 3. Deploys new version
# 4. Takes 2-5 minutes
```

## Database Backups

### Manual Backup:
```bash
# Get PSQL command from Render dashboard
pg_dump postgresql://user:pass@host/db > backup.sql
```

### Restore Backup:
```bash
psql postgresql://user:pass@host/db < backup.sql
```

## Cost Estimate

### Free Tier (Good for testing):
- 1 PostgreSQL database (90 days)
- 1 Web service (backend)
- 2 Static sites (frontend + admin)
- Total: $0/month

### Production (Recommended):
- PostgreSQL database: $7/month
- Web service (backend): $7/month
- Static sites: Free
- Total: $14/month

## Quick Deployment Checklist

- [ ] Push code to GitHub
- [ ] Create PostgreSQL database on Render
- [ ] Import schema to database
- [ ] Deploy backend web service
- [ ] Update frontend API URLs
- [ ] Update backend db.js for Render
- [ ] Deploy frontend static site
- [ ] Deploy admin static site
- [ ] Test all functionality
- [ ] Configure custom domain (optional)
- [ ] Change default admin password

## Support

- Render Docs: https://render.com/docs
- Render Community: https://community.render.com
- Status Page: https://status.render.com

---

**Render is much simpler than Hostinger VPS because:**
- No SSH/server management needed
- Automatic SSL certificates
- Built-in PostgreSQL hosting
- Auto-deploys from GitHub
- Free tier available
- Better logging and monitoring
