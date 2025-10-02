# VIM QUEST - Deployment Guide

## Hosting on Render (Recommended - FREE)

### Prerequisites
1. Create a [Render account](https://render.com) (free)
2. Create a [GitHub account](https://github.com) if you don't have one
3. Push your code to GitHub

---

## Step 1: Push to GitHub

```bash
cd /home/fanush/Desktop/learn-vim-game

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Vim Quest game"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/vim-quest.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy Backend API on Render

### 2.1 Create Web Service
1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:

**Settings:**
- **Name**: `vim-quest-api`
- **Region**: Choose closest to you
- **Branch**: `main`
- **Root Directory**: `server`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Instance Type**: `Free`

### 2.2 Add Environment Variables
Click **"Advanced"** and add these environment variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `JWT_SECRET` | (Click "Generate" for a secure random value) |
| `PORT` | `3001` |
| `CLIENT_URL` | (Leave empty for now, we'll add this after frontend deployment) |

### 2.3 Deploy
- Click **"Create Web Service"**
- Wait for deployment to complete (3-5 minutes)
- Copy your API URL (e.g., `https://vim-quest-api.onrender.com`)

---

## Step 3: Deploy Frontend on Render

### 3.1 Create Static Site
1. Click **"New +"** → **"Static Site"**
2. Select your GitHub repository
3. Configure the service:

**Settings:**
- **Name**: `vim-quest-frontend`
- **Branch**: `main`
- **Root Directory**: `client`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`

### 3.2 Add Environment Variable
Click **"Advanced"** and add:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | Your backend URL from Step 2 (e.g., `https://vim-quest-api.onrender.com`) |

### 3.3 Deploy
- Click **"Create Static Site"**
- Wait for deployment (2-3 minutes)
- Copy your frontend URL (e.g., `https://vim-quest-frontend.onrender.com`)

---

## Step 4: Update Backend CORS

1. Go back to your backend service on Render
2. Click **"Environment"** in the left sidebar
3. Update `CLIENT_URL` to your frontend URL (from Step 3)
4. Click **"Save Changes"**
5. The service will automatically redeploy

---

## Step 5: Test Your Deployment

Visit your frontend URL and test:
- ✅ Register a new account
- ✅ Login
- ✅ Complete a lesson
- ✅ Check achievements
- ✅ View progress

---

## Important Notes

### Free Tier Limitations
- **Backend**: Sleeps after 15 minutes of inactivity
  - First request after sleep takes 30-50 seconds to wake up
  - Subsequent requests are fast
- **Frontend**: Always active, no cold starts
- **Database**: SQLite file persists across deployments

### Custom Domain (Optional)
1. Buy a domain from Namecheap, Google Domains, etc.
2. In Render dashboard:
   - Frontend: Settings → Custom Domain
   - Backend: Settings → Custom Domain
3. Update DNS records as instructed
4. Update `CLIENT_URL` in backend environment variables

---

## Alternative: Deploy Backend on Railway

If you prefer Railway for the backend:

1. Go to [railway.app](https://railway.app)
2. Create a new project from GitHub
3. Select your repository
4. Set root directory to `server`
5. Add environment variables:
   - `NODE_ENV=production`
   - `JWT_SECRET=(generate random string)`
   - `CLIENT_URL=(your frontend URL)`
6. Deploy

---

## Troubleshooting

### "Failed to connect to server"
- Check that `VITE_API_URL` in frontend matches your backend URL
- Verify backend is running (visit `https://your-api-url.onrender.com`)

### "CORS error"
- Ensure `CLIENT_URL` in backend matches your frontend URL exactly
- Check that both services are deployed

### Database not persisting
- Render's free tier includes 1GB persistent disk
- Make sure `server/database.db` is in your `.gitignore`
- Database is automatically created on first run

### Backend takes long to respond
- This is normal on free tier after 15 minutes of inactivity
- Consider upgrading to paid tier ($7/month) for always-on service

---

## Monitoring

### Render Dashboard
- View logs: Service → Logs tab
- Check metrics: Service → Metrics tab
- Monitor uptime: Service → Events tab

### Health Checks
Add this endpoint to your server to monitor health:

```javascript
// In server/server.js
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
```

---

## Costs

**Free Forever (Render):**
- Frontend: FREE
- Backend: FREE (sleeps after 15 mins)
- Database: FREE (1GB)

**Upgrade Options:**
- Backend always-on: $7/month
- More resources: $25+/month

---

## Support

- Render Docs: https://render.com/docs
- Render Community: https://community.render.com
- GitHub Issues: Report bugs in your repository

---

## Next Steps

1. ✅ Deploy to Render
2. Share your game URL!
3. Consider adding:
   - Analytics (Google Analytics, Plausible)
   - Error tracking (Sentry)
   - User feedback form
   - More lessons

---

**Congratulations! Your Vim Quest game is now live! 🎉**
