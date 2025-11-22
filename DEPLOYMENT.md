# Deployment Guide

This guide covers deploying the Tech Solutions application to various platforms.

## Table of Contents
1. [Heroku Deployment](#heroku-deployment)
2. [Vercel + MongoDB Atlas](#vercel--mongodb-atlas)
3. [Railway Deployment](#railway-deployment)
4. [DigitalOcean App Platform](#digitalocean-app-platform)

---

## Prerequisites

Before deploying, ensure you have:
- A MongoDB Atlas account (for cloud database)
- Git repository with your code
- Account on your chosen deployment platform

## MongoDB Atlas Setup

All deployment options require a cloud database. MongoDB Atlas offers a free tier perfect for getting started.

### 1. Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster (choose the free M0 tier)

### 2. Configure Database Access
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Create a username and strong password
4. Grant "Read and write to any database" permissions

### 3. Configure Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Confirm

### 4. Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `myFirstDatabase` with `techsolutions`

Your connection string should look like:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/techsolutions?retryWrites=true&w=majority
```

---

## Heroku Deployment

### 1. Install Heroku CLI
```bash
# Download from https://devcenter.heroku.com/articles/heroku-cli
# Or use npm
npm install -g heroku
```

### 2. Login to Heroku
```bash
heroku login
```

### 3. Create Heroku App
```bash
heroku create your-app-name
```

### 4. Set Environment Variables
```bash
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI="your-mongodb-atlas-connection-string"
heroku config:set JWT_SECRET="your-secret-key-here"
heroku config:set CLIENT_URL="https://your-app-name.herokuapp.com"
```

### 5. Deploy
```bash
git add .
git commit -m "Prepare for deployment"
git push heroku main
```

### 6. Seed Database
```bash
heroku open
# Navigate to: https://your-app-name.herokuapp.com/api/seed
```

### 7. View Logs
```bash
heroku logs --tail
```

---

## Vercel + MongoDB Atlas

Vercel is great for the frontend, but you'll need a separate backend hosting.

### Option 1: Vercel Frontend + Heroku Backend

1. **Deploy Backend to Heroku** (follow Heroku steps above)

2. **Deploy Frontend to Vercel:**
   ```bash
   cd frontend
   npm install -g vercel
   vercel login
   ```

3. **Configure Frontend Environment:**
   - Create `frontend/.env.production`:
     ```env
     REACT_APP_API_URL=https://your-backend-app.herokuapp.com
     ```

4. **Deploy:**
   ```bash
   vercel --prod
   ```

### Option 2: Full Stack on Vercel (Serverless)

This requires restructuring your backend to use serverless functions. Not recommended for this project structure.

---

## Railway Deployment

Railway offers an easy deployment experience with automatic HTTPS.

### 1. Create Railway Account
Go to [Railway.app](https://railway.app) and sign up

### 2. Install Railway CLI
```bash
npm install -g @railway/cli
```

### 3. Login
```bash
railway login
```

### 4. Initialize Project
```bash
railway init
```

### 5. Add MongoDB Atlas
1. Go to your Railway project dashboard
2. Click "New" → "Database" → "Add MongoDB" (or use your Atlas connection)

### 6. Set Environment Variables
In the Railway dashboard:
- `NODE_ENV` = `production`
- `MONGODB_URI` = Your MongoDB Atlas connection string
- `JWT_SECRET` = Your secret key
- `CLIENT_URL` = Your Railway app URL (will be provided after first deploy)

### 7. Deploy
```bash
railway up
```

### 8. Get Your URL
```bash
railway open
```

---

## DigitalOcean App Platform

### 1. Create DigitalOcean Account
Sign up at [DigitalOcean](https://www.digitalocean.com)

### 2. Create New App
1. Click "Create" → "Apps"
2. Connect your GitHub repository
3. Select the repository and branch

### 3. Configure Build Settings
- **Build Command:** `npm install && cd frontend && npm install && npm run build && cd ..`
- **Run Command:** `npm start`

### 4. Set Environment Variables
Add these in the App Platform dashboard:
- `NODE_ENV` = `production`
- `MONGODB_URI` = Your MongoDB Atlas connection string
- `JWT_SECRET` = Your secret key
- `CLIENT_URL` = Your app URL (will be provided)
- `PORT` = `8080` (DigitalOcean default)

### 5. Deploy
Click "Create Resources" and wait for deployment

---

## Post-Deployment Checklist

After deploying to any platform:

- [ ] Test the health endpoint: `https://your-app-url/api/health`
- [ ] Seed the database: `https://your-app-url/api/seed`
- [ ] Test login with admin credentials
- [ ] Test creating an order
- [ ] Check browser console for errors
- [ ] Verify CORS is working (no CORS errors in console)
- [ ] Test on mobile devices

---

## Troubleshooting

### CORS Errors
- Ensure `CLIENT_URL` environment variable is set correctly
- Check that your frontend URL matches the CORS origin

### Database Connection Errors
- Verify MongoDB Atlas connection string is correct
- Check that IP whitelist includes 0.0.0.0/0
- Ensure database user has correct permissions

### Build Failures
- Check that all dependencies are in `package.json`
- Verify Node.js version compatibility
- Review build logs for specific errors

### 404 Errors on Refresh
- Ensure the catch-all route is configured in `server.js`
- For Vercel, add a `vercel.json` with rewrites

---

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `5000` or `8080` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret for JWT tokens | Random string |
| `CLIENT_URL` | Frontend URL for CORS | `https://your-app.com` |
| `CLOUDINARY_*` | Image upload service (optional) | From Cloudinary dashboard |

---

## Updating Your Deployment

### Heroku
```bash
git add .
git commit -m "Update message"
git push heroku main
```

### Railway
```bash
railway up
```

### Vercel
```bash
vercel --prod
```

### DigitalOcean
Push to your connected GitHub branch, and it will auto-deploy.

---

## Custom Domain Setup

### Heroku
```bash
heroku domains:add www.yourdomain.com
```

### Vercel
1. Go to project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### Railway
1. Go to project settings
2. Click "Domains"
3. Add custom domain
4. Update DNS records

---

## Monitoring and Logs

### Heroku
```bash
heroku logs --tail
```

### Railway
```bash
railway logs
```

### DigitalOcean
View logs in the App Platform dashboard

---

## Support

If you encounter issues:
1. Check the platform's status page
2. Review deployment logs
3. Verify all environment variables
4. Test locally with production environment variables
5. Check the troubleshooting section above

For platform-specific issues, consult their documentation:
- [Heroku Docs](https://devcenter.heroku.com/)
- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app/)
- [DigitalOcean Docs](https://docs.digitalocean.com/products/app-platform/)
