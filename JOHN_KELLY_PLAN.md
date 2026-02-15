# John Kelly Archive Plan

## Source
**URL:** [https://johnkellycapelstreet.ie/johns-repertoire/](https://johnkellycapelstreet.ie/johns-repertoire/)
**Type:** WordPress site with "Portfolio" structure for tunes.

## Structure Analysis
This archive is organized by "Projects" where each project represents a tune or set of tunes.
*   **Listing Page:** A grid of items.
*   **Detail Page:** Contains the audio player, title, and historical context.
*   **Audio Hosting:** Self-hosted MP3s in `wp-content/uploads`.
    *   Example: `https://johnkellycapelstreet.ie/wp-content/uploads/2019/09/barrytaylor-tape006-2reels-hughietravers.mp3`

## Data to Extract
1.  **Title:** From `h1.page-title` or the portfolio grid item title.
2.  **Audio URL:** The `src` attribute of the `<source>` tag inside `<audio>`.
3.  **Tune Type:** Often listed as a category (e.g., "Reels", "Jigs") or inferable from title.
4.  **Description:** The main body text usually contains valuable provenance ("John learned this from...").
5.  **Instruments:** Default to "Fiddle" or "Concertina" (John played both), but we might need to listen or check text for specifics.

## Implementation Steps

### 1. Scraper Script (`scripts/scrape-john-kelly.js`)
*   **Dependencies:** `axios`, `cheerio`
*   **Logic:**
    1.  Fetch the Repertoire page to get a list of all 50-100 tune URLs.
    2.  Iterate through each URL.
    3.  Parse the HTML to find the MP3 link.
    4.  Clean metadata (remove "Project:" prefixes, etc.).
    5.  Save to `john-kelly-tunes.json`.
    
### 2. Audio Migration
*   **Action:** Run `scripts/upload-john-kelly-to-cloudinary.js`.
*   **Reasoning:** Consistent hosting, faster playback, secure SSL.

### 3. Data Ingestion
*   **Action:** Merge into `backend/data/tunes.json`.
*   **Metadata:**
    *   `collection`: "John Kelly Archive"
    *   `artist`: "John Kelly"
    *   `region`: "Clare / Dublin"
    *   `sourceUrl`: The original project page URL.

## Challenges
*   **Instruments:** John Kelly played both Fiddle and Concertina. We may need to auto-detect mentions of "concertina" in the description to tag instances correctly, otherwise default to Fiddle?
*   **Multiple Tracks:** Some pages might have multiple audio players. The scraper needs to handle arrays of tracks per page.

## Next Steps
1.  Approve this plan.
2.  Create the scraper script.
3.  Run the initial scrape to assess data quality.
