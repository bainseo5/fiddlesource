# 🚀 Deploy FiddleSource to Railway (Free)

## Quick Deploy (5 minutes)

### Option A: Using Railway CLI (Fastest)

1. **Install Railway CLI:**
   - Go to https://railway.app/install
   - Download and install for Windows
   - Restart your terminal

2. **Login to Railway:**
   ```bash
   railway login
   ```
   - Opens browser, authenticate with GitHub

3. **Deploy from this directory:**
   ```bash
   railway up
   ```
   - Railway auto-detects Node.js project
   - Uploads files and deploys
   - Shows you the live URL when done!

4. **Done!** Your app is live 🎉

---

### Option B: Deploy via Railway Web Dashboard

1. Go to https://railway.app
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub Repo"
4. *If you have Git:*
   - Authorize Railway
   - Select `fiddlesource` repository
   - Railway auto-deploys on every push
5. *If no Git:*
   - Click "Deploy with CLI" instead
   - Follow Option A above

---

## After Deployment

### View Your Live App
- Railway gives you a URL like: `https://fiddlesource.up.railway.app`
- Click the URL in Railway dashboard to open it

### Check Logs
```bash
railway logs
```

### Redeploy After Changes
```bash
railway up
```
or (if using GitHub):
```bash
git push origin main
```
Railway auto-deploys!

---

## Configuration

Railway automatically:
- ✅ Sets `PORT` environment variable
- ✅ Installs Node.js
- ✅ Runs `npm install` in backend folder
- ✅ Starts with `node backend/server.js`

All tunes and audio are included in deployment!

---

## Troubleshooting

**"Port is already in use"** → Railway assigns its own port, ignore this

**"Audio files not loading"** → Check that output/ folder is included in deployment

**"Cannot find module"** → Run `npm install` locally first, then deploy

---

## Next Steps (Optional)

- **Add Custom Domain:** In Railway dashboard → Settings → Custom Domain
- **Add to Production:** Set up auto-deploy from GitHub
- **Increase Limits:** Railway free tier is generous!

Enjoy! 🎵
