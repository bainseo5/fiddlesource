# FiddleSource - Traditional Music Archive

A comprehensive digital archive of traditional Irish music sessions, designed to preserve, organize, and make accessible rare field recordings of master musicians.

## 🎵 Project Mission

FiddleSource transforms long, raw field recordings into structured, searchable digital data. It takes single audio files of entire sessions (often 30-45 minutes long) and:

1.  **Splits** them into individual tracks for each tune.
2.  **Identifies** the tunes, musicians, and instruments.
3.  **Preserves** the metadata (date, location, collection).
4.  **Serves** them via a modern React interface.

## 🛠️ Technology Stack

-   **Frontend:** React + TypeScript (Vite)
-   **Backend:** Node.js + Express
-   **Data Processing:** Custom Node.js scripts + FFmpeg
-   **Database:** JSON-based local database (easily portable)
-   **Hosting:** Railway (Backend) / Vercel or Netlify (Frontend capable)
-   **Audio Storage:** Cloudinary (Automatic streaming optimization)

## 🚀 Getting Started

### Prerequisites
-   Node.js (v18+)
-   FFmpeg (Installed and added to system PATH)

### Installation
1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/fiddlesource.git
    cd fiddlesource
    ```
2.  Install dependencies:
    ```bash
    npm install
    cd backend && npm install && cd ..
    ```

3.  Configure Environment:
    Create a `.env` file in the root directory:
    ```env
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    ```

### Running Locally
To start the standard development environment:
```bash
npm run dev
```

## 📂 Project Structure

-   `scripts/`: The heart of the processing pipeline (scrapers, splitters).
-   `backend/`: Express server API.
    -   `backend/data/`: The `tunes.json` database.
-   `src/`: React frontend application.
-   `archive/`: Storage for raw MP3 files (not committed to Git).

## 📚 Documentation

-   **[Adding New Sessions](ADDING_NEW_SESSIONS.md)**: The core workflow for ingesting new music.
-   **[Backend Setup](BACKEND_SETUP.md)**: Server configuration details.

---

*Preserving the tradition, one tune at a time.*
