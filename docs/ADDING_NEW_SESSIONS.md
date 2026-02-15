# Workflow: Adding New Sessions

This document outlines the standard 3-step process for adding new traditional music sessions to the archive.

##  Important Prerequisites
*   **Source File:** You must have the original MP3 file downloaded to your local rchive/ folder.
*   **FFmpeg:** Must be installed and accessible in your terminal.
*   **File Naming:** Ensure downloaded files match the names expected by the scripts (usually Location_Date.mp3 or similar).

---

## 1. Scrape & Generate Scripts (One-Time Setup)

*Note: This step has largely been completed for the Clare Library "Live" section (Taylor, Healy, Carroll-Mackenzie collections).*

We use a scraper to read the Clare Library website and automatically generate the processing scripts for each session.

`ash
node scripts/scrapers/scrape_clare_library_sessions.js
`

This creates individual scripts in the scripts/generated-session-scripts/ directory, e.g., split-annagh_CM-WC5.js.

---

## 2. Process a Session (Split Audio)

Pick a session you want to ingest from the scripts/generated-session-scripts/ folder.

1.  **Open the Script:** (e.g., scripts/generated-session-scripts/split-annagh_CM-WC5.js)
2.  **Verify Source Path:** Check the SOURCE_FILE constant at the top. Ensure it points to your downloaded MP3.
3.  **Check Timestamps:**
    *   The scraper attempts to import timestamps.
    *   If you see 'TBD' in the start or end fields, you must listen to the audio and manually enter the minutes.seconds (e.g., '3.45').
    *   Check for "Medleys" (tunes played back-to-back). These often need manual timestamping.

4.  **Run the Splitter:**
    `ash
    node scripts/generated-session-scripts/split-annagh_CM-WC5.js
    `

**Output:**
*   **Audio:** Individual MP3 files created in output/ and src/data/tunes.json.
*   **Data:** A JSON file created in output/ (e.g., nnagh_CM-WC5-tunes.json) containing all metadata.

---

## 3. Merge into Database

Once you are happy with the split results, import the new tunes into the main application database.

`ash
node scripts/merge-session.js output/annagh_CM-WC5-tunes.json
`

**This script will:**
1.  Backup your existing ackend/data/tunes.json.
2.  Add the new tunes to the database.
3.  Skip any duplicates automatically.

---

## 4. Upload to Cloud (Cloudinary)

Finally, make the audio accessible online.

1.  **Run the generic uploader:**
    *(Currently setup for specific sessions, but easily adaptable)*
    `ash
    node scripts/backend/updateCloudinaryUrls.js
    `
    *Note: You may need to edit this script to target your specific new files if doing valid partial uploads.*

2.  **Verify:** Check the application to ensure the new tunes play correctly.

---

## 5. Cleanup
*   You can delete the temporary MP3s in output/ once they are safely on Cloudinary.
*   Keep the original raw recording in rchive/ for safety.
