# Splitting Multi-Tune Audio Files

This guide explains how to split audio files containing multiple tunes into individual tune files.

## Overview

Many recordings in the archive contain 2-3 tunes played in sequence (e.g., "Reels (2): Boys of Ballisodare/Hare's Paw"). This workflow helps you:

1. Identify where each tune starts/stops in the audio
2. Split the audio file into separate files
3. Upload to Cloudinary
4. Update the database

## Files Involved

- **split-multi-tunes.py** - Main script to split audio files using ffmpeg
- **update-tunes-with-splits.py** - Updates tunes.json with new individual tune entries
- **split-manifest.json** - Generated log of all split operations
- **split-tunes/** - Output directory for split audio files

## Workflow

### Step 1: Identify Timestamps

Listen to each multi-tune audio file and note when each tune starts and stops.

**Files to split (27 total):**
- 15 Mullagh session files
- 6 Bonavella session files  
- 6 Doolin session files

**Tips for finding timestamps:**
- Use Audacity, VLC, or your audio player of choice
- Tunes typically have a brief pause or key change between them
- Listen for when musicians count in or call out the next tune
- Note: Timestamps can be in format "HH:MM:SS", "MM:SS", or just seconds

### Step 2: Add Timestamps to Script

Edit `split-multi-tunes.py`:

```python
"mullagh-01_Reels_2___Boys_of_Ballisodare_Hare_s_Paw.mp3": {
    "id": "mullagh-01",
    "splits": [
        {"title": "Boys of Ballisodare", "start": "00:00:00", "end": "00:01:05", "key": "D"},
        {"title": "Hare's Paw", "start": "00:01:05", "end": "00:02:13", "key": "G"},
    ]
},
```

Add the timestamps for each tune within each file.

### Step 3: Run Split Script

Requires ffmpeg to be installed.

```bash
# Make sure you're in the scripts directory
cd scripts

# Run the split script
python split-multi-tunes.py
```

This will:
- Create `split-tunes/` directory with individual MP3 files
- Generate `split-manifest.json` with metadata about each split
- Output format: `mullagh-01-a_Boys_of_Ballisodare.mp3`, `mullagh-01-b_Hares_Paw.mp3`, etc.

### Step 4: Upload to Cloudinary

Upload all files from `split-tunes/` to Cloudinary:

**Via Cloudinary Dashboard:**
1. Go to https://console.cloudinary.com/
2. Navigate to Media Library
3. Upload all files from `split-tunes/` folder
4. Make sure to use the same naming convention

**Via Upload Script (if automated):**
```bash
# You can create a batch upload script similar to the original Cloudinary upload
cd ../backend
node uploadSplitTunesToCloudinary.js
```

### Step 5: Fetch Cloudinary URLs

Run the fetch script to get actual Cloudinary URLs:

```bash
cd ../backend
node fetchCloudinaryUrls.js
```

This will find all the new uploaded files and update the URLs.

### Step 6: Update Database

Run the update script to add individual tune entries:

```bash
cd ../scripts
python update-tunes-with-splits.py
```

Choose whether to:
- Keep original multi-tune entries (marked as deprecated)
- Remove original multi-tune entries (recommended)

This will:
- Create new entries for each individual tune
- Copy metadata from original (artist, source, year, etc.)
- Mark audioUrls that need updating
- Create backup of tunes.json before changes

### Step 7: Deploy

Commit and push changes to GitHub:

```bash
git add backend/data/tunes.json
git commit -m "Split multi-tune recordings into individual tunes"
git push
```

Railway will auto-deploy the updated database.

## Example: Splitting One File

Let's say you want to split "Reels (2): Boys of Ballisodare/Hare's Paw":

1. **Listen** to `mullagh-01_Reels_2___Boys_of_Ballisodare_Hare_s_Paw.mp3`
   - Boys of Ballisodare runs from 0:00 to 1:05
   - Hare's Paw runs from 1:05 to 2:13

2. **Edit** split-multi-tunes.py:
   ```python
   "mullagh-01_Reels_2___Boys_of_Ballisodare_Hare_s_Paw.mp3": {
       "id": "mullagh-01",
       "splits": [
           {"title": "Boys of Ballisodare", "start": "00:00:00", "end": "00:01:05", "key": "D"},
           {"title": "Hare's Paw", "start": "00:01:05", "end": "00:02:13", "key": "G"},
       ]
   },
   ```

3. **Run** `python split-multi-tunes.py`
   - Creates: `split-tunes/mullagh-01-a_Boys_of_Ballisodare.mp3`
   - Creates: `split-tunes/mullagh-01-b_Hares_Paw.mp3`

4. **Upload** both files to Cloudinary

5. **Update** database with `python update-tunes-with-splits.py`

6. **Done!** Now each tune has its own entry and audio file

## Multi-Tune Files to Split

### Mullagh Session (15 files)
- mullagh-01: Boys of Ballisodare / Hare's Paw (2)
- mullagh-02: Mamma's Pet / Bloom of Youth / Heathery Breeze (3)
- mullagh-03: Down the Broom / Gatehouse Maid / Ivy Leaf (3)
- mullagh-04: Old Torn Petticoat / Green Fields of America (2)
- mullagh-05: Kerry Reel / Morning Dew / Woman of the House (3)
- mullagh-06: Apples in Winter / Trip to Sligo (2 jigs)
- mullagh-07: Five Mile Chase / Abbey Reel (2)
- mullagh-08: Jackie Coleman's / Bucks of Oranmore (2)
- mullagh-10: Shaskeen / Molloy's Favourite (2)
- mullagh-11: Paddy Murphy's Wife / Stony Steps (2)
- mullagh-13: Tarbolton / Longford Collector / Sailor's Bonnet (3)
- mullagh-14: O'Rourke's / Wild Irishman (2)
- mullagh-16: Rodney's Glory / Mount Famous Hunt (2 set dances)
- mullagh-17: Green Groves of Erin / Ivy Leaf (2)
- mullagh-18: Maid in the Meadow / Rambling Pitchfork (2 jigs)

### Bonavella Session (6 files)
- bonavella-01: Boys of Ballisodare / Hare's Paw? (2)
- bonavella-05: Monk's / Rambling Pitchfork (2 jigs)
- bonavella-06: Ask my Father (single jig) / Dusty Miller (slip jig) (2)
- bonavella-07: Hand Me Down the Tackle / Dublin / Silver Spear (3)
- bonavella-10: Mist Covered Mountain / Garrett Barry's? (1 or 2?)
- bonavella-11: Dairy Maid / Flax in Bloom (2)

### Doolin Session (6 files)
- doolin-03: Galway Rambler / Sheehan's (Wellington) (2)
- doolin-05: Old Bush / Galtee (2)
- doolin-06: Ladies Pantalettes / Collier's (2)
- doolin-40: Miss McLeod's / Philip O'Beirne's Delight (2)
- doolin-51: Wind that Shakes the Barley / Last Night's Fun (2)
- doolin-55: Tarbolton / Longford Collector / Sailor's Bonnet (3)

**Total: 27 files → ~60 individual tunes**

## Troubleshooting

**ffmpeg not found:**
- Install ffmpeg: https://ffmpeg.org/download.html
- Windows: Add ffmpeg to PATH or use full path in script
- Mac: `brew install ffmpeg`
- Linux: `apt-get install ffmpeg`

**Wrong timestamps:**
- Re-edit the splits in split-multi-tunes.py
- Delete the old output files from split-tunes/
- Run the script again

**Can't hear where tunes split:**
- Use Audacity (free) for visual waveform
- Look for gaps/pauses in the waveform
- Listen at 0.5x speed if needed

**Cloudinary upload failed:**
- Check file size limits (free tier: 100 MB per file)
- Check total storage usage
- Try uploading via dashboard instead of API
