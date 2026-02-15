# Session Ingestion Workflow

This document outlines the standard operating procedure for adding a new session (or tape) from the Clare Library (or other sources) into the Fiddlesource archive.

## Prerequisites

- **Node.js** installed
- **FFmpeg** installed and in your system PATH
- **Cloudinary** credentials (API Key, Secret, Cloud Name) in `.env` or environment variables

## Step 1: Selection & Tracking

1.  Check [COLLECTION_TRACKER.md](COLLECTION_TRACKER.md) to see which session is next in the queue.
2.  Mark the session as "In Progress" (🔄).
3.  Navigate to the source URL (usually Clare Library) to find the audio file and track listing.

## Step 2: Download & Setup

1.  Download the main MP3 file for the session.
2.  Save it to the `archive/` folder.
    - *Naming Convention:* `JH[ID]_[Location]_[Date].mp3` (e.g., `JH24-1_Kiltannon_1972.mp3`).
    - *Note:* The file path in the script must match this location.

## Step 3: Create the Split Script

Create a new script in `scripts/` (e.g., `scripts/split-new-session.js`) based on previous examples like `scripts/split-kiltannon-session.js`.

**Key components to configure:**
- `SOURCE_FILE`: Path to the downloaded MP3 in `archive/`.
- `sessionInfo`: Object containing metadata (Recorder, Location, Date, Region, Collection).
- `tracks`: Array of objects. Each object represents a tune/track.
    - `id`: Unique suffix (e.g., `sessionname-01`).
    - `start`: Start time (string like "0.00" or "1:30").
    - `end`: End time (string like "1.45" or "2:15").
    - `title`: Name of the tune.
    - `type`: Reel, Jig, Hornpipe, etc.
    - `instruments`: "Fiddle", "Flute", etc.
    - `artist`: Performer name(s).
    - `key` (optional): Key of the tune if known, otherwise "?".

**Run the split script:**
```bash
node scripts/split-new-session.js
```
*Result:* This will generate MP3 clips in the `output/` folder and a JSON file (e.g., `scripts/new-session-tunes.json`) containing the database entries.

## Step 4: Merge Data into Database

Create a merge script (e.g., `scripts/merge-new-session.js`) or use a generic one if available. It needs to read the JSON generated in Step 3 and merge it into `backend/data/tunes.json`.

**Run the merge script:**
```bash
node scripts/merge-new-session.js
```
*Result:* `backend/data/tunes.json` now contains the new tunes. The `audioUrl` fields will point to cloud locations that **do not exist yet**.

## Step 5: Upload Audio to Cloudinary

Create an upload script (e.g., `scripts/upload-new-session.js`) simply targeting the files in `output/` that start with your session prefix.

**Key components:**
- Use `cloudinary` SDK.
- Target folder: `fiddlesource`.
- `public_id`: filename without extension (e.g., `sessionname-01`).

**Run the upload script:**
```bash
node scripts/upload-new-session.js
```
*Result:* Files are live on Cloudinary. The URLs in `tunes.json` (from Step 4) are now valid.

## Step 6: Verify & deploy

1.  **Test Locally:** Run `npm run dev` and check the new tunes on the local site.
2.  **Update Tracker:** Mark the session as "Complete" (✅) in `COLLECTION_TRACKER.md`.
3.  **Commit & Push:**
    ```bash
    git add .
    git commit -m "Add [Session Name] (JH[ID])"
    git push origin main
    ```
4.  **Deployment:** The push will trigger a deployment (e.g., on Railway), making the new tunes live for everyone.

## File Cleanup (Optional)

- Delete the generated MP3s in `output/` to save space (they are now in the cloud).
- Keep the source MP3 in `archive/` if you want a local backup.
