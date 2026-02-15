# 🎻 Next Session Workflow Guide

This guide documents the refined workflow for processing new sessions (e.g., Mullagh, Bonavella), incorporating lessons learned from the Aughrim/Paddy Fahy session.

## 1. Preparation (The "Enhanced Schema")

When preparing a new `split-SESSIONNAME.js` script, ensure the `tunes.push({...})` object includes **all** of the following fields to avoid post-processing fixes:

| Field | Value / Source | Example |
| :--- | :--- | :--- |
| `genre` | **Must be "Irish Traditional"** | "Irish Traditional" |
| `type` | The actual tune type | "Jig", "Reel", "Hornpipe" |
| `artist` | Full artist string (or truncated if massive) | "Paddy Fahy (fiddle)" |
| `recordingType` | "session" or "solo" | "session" |
| `year` | Extracted year or string | "1976" |
| `region` | The geographical location (auto-pulled from session metadata) | "Mullagh", "Chicago", "Aughrim, Co. Galway" |
| `description` | Full context paragraph | "Recorded in Katty's Bar..." |
| `sourceCollection` | Full specific collection name | "BR Taylor Collection Tape 019-2" |

**Best Practice:**
- Define a `const SESSION_REGION = "..."` at the top of your split script and use it for every tune object.
- When merging new tracks into `tunes.json`, verify each has a `region` field. If missing, fill from the session context.
- Consider running a script to list all unique regions in the DB to keep your UI filter up to date.

### 🛑 Stop & Check
Examples of updated scripts are:
- `scripts/generated-session-scripts/split-mullagh-session.js`
- `scripts/generated-session-scripts/split-bonavella-session.js`

**Do not run old scripts without patching them first!**

## 2. Processing Steps

### A. Split Audio & Generate Metadata
Run the specific session script:
```bash
node scripts/generated-session-scripts/split-mullagh-session.js
```
*Output*: 
- MP3s in `scripts/output/`
- JSON in `scripts/generated-session-scripts/mullagh-tunes.json` (or similar)

### B. Merge to Database
Manually copy the objects from the generated JSON into `backend/data/tunes.json`.
*   *Tip*: Ensure IDs are unique.
*   *Tip*: Ensure every tune has a `region` field (auto from session if possible).

### C. Upload to Cloudinary
Use the generic upload script. You may need to edit `scripts/upload-session.js` to point to the correct local folder and file prefix.
```bash
# Edit scripts/upload-session.js first!
node scripts/upload-session.js
```
This script will:
1.  Upload files from `scripts/output`.
2.  Update `backend/data/tunes.json` with the new Cloudinary URLs.

### D. Verify & Deploy
1.  Run `npm run dev`.
2.  Check the "Newest Tunes" or search for the session.
3.  **Verify UI Tags**:
    - Does "SESSION" or "SOLO" appear on the card?
    - Does the "About" section show the full description with newlines?
    - Does the region filter show the new region?
4.  Commit and Push.

## 3. Troubleshooting
- **Missing Artist Crash**: If the app crashes, run `node scripts/fix-missing-artists.js`.
- **Formatting Issues**: If description text is bunched up, ensure `TuneDetailPage.tsx` uses `whitespace-pre-line`.
