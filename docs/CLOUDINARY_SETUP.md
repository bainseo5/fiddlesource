# Cloudinary Storage Setup Guide

## Step 1: Create Cloudinary Account

1. Go to [cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
2. Sign up (no credit card required)
3. Verify your email
4. You'll get your dashboard with **25 GB free storage**

## Step 2: Upload Audio Files

### Option A: Web Dashboard (Easiest)

1. Log into [Cloudinary Console](https://cloudinary.com/console)
2. Go to **Media Library**
3. Click **Upload** → **Add files**
4. Create a folder called `audio` (optional, for organization)
5. Select all MP3 files from your `output/` directory (156 MB)
6. Upload and wait for completion

### Option B: Bulk Upload via CLI

```bash
# Install Cloudinary CLI
npm install -g cloudinary-cli

# Configure (get API key from dashboard)
cloudinary config

# Upload entire folder
cloudinary upload_dir output/ audio/ --resource_type video
```

Note: Use `--resource_type video` for audio files (Cloudinary groups audio/video together)

## Step 3: Get Your URLs

After uploading, each file gets a URL like:
```
https://res.cloudinary.com/YOUR_CLOUD_NAME/video/upload/audio/filename.mp3
```

### Find Your Cloud Name:
1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Look for **Cloud name** at the top (e.g., "dg8s7example")
3. Your base URL will be:
   ```
   https://res.cloudinary.com/YOUR_CLOUD_NAME/video/upload/audio/
   ```

## Step 4: Update Your Database

1. Open `scripts/update-cloudinary-urls.js`
2. Update the `CLOUDINARY_CLOUD_NAME` constant
3. Run the script:
   ```bash
   node scripts/update-cloudinary-urls.js
   ```

This automatically updates all audio URLs in your database.

## Step 5: Deploy to Railway

```bash
git add backend/tunes.db
git commit -m "Update audio URLs to Cloudinary CDN"
git push
```

Railway auto-deploys and your audio now streams from Cloudinary! 🎵

## Alternative: Quick Manual URLs

If you uploaded to the root of Media Library (not in a folder), URLs will be:
```
https://res.cloudinary.com/YOUR_CLOUD_NAME/video/upload/FILENAME.mp3
```

## Benefits

✅ **25 GB storage** (156 MB is only 0.6% used)
✅ **25 GB/month bandwidth** (plenty for your use case)
✅ **Global CDN** (fast everywhere)
✅ **Auto image/video optimization** (works for audio too)
✅ **No credit card required**
✅ **Great free tier that actually works**

## Verification

1. Test one URL directly in browser:
   ```
   https://res.cloudinary.com/YOUR_CLOUD_NAME/video/upload/audio/01_Reels%20(2)_%20Down%20the%20Broom_Gatehouse%20Maid.mp3
   ```

2. If it plays, run the update script

3. Deploy and test on Railway

## Cost

**$0** - Well within free tier limits! 🎉
