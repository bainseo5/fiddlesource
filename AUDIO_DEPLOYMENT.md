# Audio Files Deployment Guide

Your audio files (156 MB) are too large for GitHub. Here are your options:

## Option 1: Railway Volume (Recommended)

1. **Create a Railway Volume:**
   - Go to your Railway project dashboard
   - Click on your service
   - Go to "Variables" tab
   - Add a new volume:
     - Mount Path: `/app/output`
     - Size: 1 GB

2. **Upload audio files to the volume:**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login to Railway
   railway login
   
   # Link to your project
   railway link
   
   # SSH into your service and upload files
   railway run bash
   
   # From your local machine, use SCP or upload via Railway's file system
   ```

3. **Or use Railway's web interface:**
   - Some Railway plans allow file browser access
   - Upload files directly through the dashboard

## Option 2: Git LFS (Git Large File Storage)

1. **Install Git LFS:**
   ```bash
   git lfs install
   ```

2. **Track MP3 files:**
   ```bash
   git lfs track "output/*.mp3"
   git add .gitattributes
   ```

3. **Commit and push:**
   ```bash
   git add output/
   git commit -m "Add audio files via LFS"
   git push
   ```

4. **Update `.gitignore`** - Remove these lines:
   ```
   output/
   *.mp3
   *.wav
   ```

**Note:** Git LFS has storage limits on free plans.

## Option 3: External Storage (S3/Cloudinary)

Upload files to a CDN and update `audioUrl` in your database to use external URLs.

### Using Cloudinary (free tier: 25GB):

1. Sign up at cloudinary.com
2. Upload your MP3 files
3. Update audio URLs in your database to point to Cloudinary URLs
4. Update backend to proxy/redirect audio requests

## Option 4: Separate Audio Server

Host audio files on a separate static file server:
- Vercel (for static files)
- Netlify
- GitHub Pages (with Git LFS)
- Any CDN provider

---

## Current Status

✅ Backend server configured to serve static files from `output/`
✅ Frontend build configured properly
❌ Audio files not in GitHub repository (blocked by `.gitignore`)

You must choose one of the options above to deploy audio files to Railway.
