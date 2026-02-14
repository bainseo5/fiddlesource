# Firebase Storage Setup Guide

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name (e.g., "traditional-music-archive")
4. Disable Google Analytics (not needed)
5. Click **"Create project"**

## Step 2: Enable Storage

1. In left sidebar, click **"Storage"**
2. Click **"Get started"**
3. Select **"Start in production mode"**
4. Choose a storage location (default is fine)
5. Click **"Done"**

## Step 3: Set Public Read Access

1. Go to **Storage → Rules** tab
2. Replace the rules with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /audio/{allPaths=**} {
      allow read: if true;  // Public read access
      allow write: if false; // No public writes
    }
  }
}
```

3. Click **"Publish"**

## Step 4: Upload Audio Files

### Option A: Web Interface (Easiest)

1. Go to **Storage → Files** tab
2. Click **"Create folder"** → name it `audio`
3. Click into the `audio` folder
4. Click **"Upload files"**
5. Select all 133 MP3 files from your `output/` directory
6. Wait for upload to complete (156 MB)

### Option B: Firebase CLI (Faster for many files)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize in your project
cd fiddlesource_-traditional-music-archive
firebase init storage

# Upload files
firebase deploy --only storage
```

Then create `firebase.json` in your project root:
```json
{
  "storage": {
    "rules": "storage.rules"
  }
}
```

## Step 5: Get Your Firebase Base URL

1. In Storage, click any uploaded file
2. Copy the URL - it looks like:
   ```
   https://firebasestorage.googleapis.com/v0/b/your-project.appspot.com/o/audio%2Ffile.mp3?alt=media
   ```

3. Extract the base URL (everything before the filename):
   ```
   https://firebasestorage.googleapis.com/v0/b/your-project.appspot.com/o/audio%2F
   ```

## Step 6: Update Your Database

1. Open `scripts/update-firebase-urls.js`
2. Update the `FIREBASE_BASE_URL` constant with your base URL
3. Run the script:
   ```bash
   node scripts/update-firebase-urls.js
   ```

This will update all 133+ tunes in your database to use Firebase URLs.

## Step 7: Deploy to Railway

1. Commit your changes:
   ```bash
   git add .
   git commit -m "Update audio URLs to Firebase Storage"
   git push
   ```

2. Railway will auto-deploy
3. Your app now streams audio from Firebase! 🎵

## Verification

Test a few tunes to ensure audio plays correctly:
- Open your deployed Railway app
- Play different tunes
- Check browser console for any errors

## Benefits

✅ **No more audio file deployment issues**
✅ **Fast CDN delivery worldwide**
✅ **156 MB of 5 GB used (97% free space remaining)**
✅ **Railway deploys faster (no large files)**
✅ **Audio URLs work from anywhere**

## Costs

- Firebase: **$0** (well within free tier)
- Railway: **$0** (free tier)

Total: **FREE** 🎉
