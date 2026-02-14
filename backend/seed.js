import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'data');
const TUNES_FILE = path.join(DATA_DIR, 'tunes.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

// Helper functions
const timeToSeconds = (timeStr) => {
  const parts = timeStr.split(':').map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return 0;
};

const getGenre = (title) => {
  if (title.toLowerCase().includes('reel')) return 'Reel';
  if (title.toLowerCase().includes('jig')) return 'Jig';
  if (title.toLowerCase().includes('waltz')) return 'Waltz';
  if (title.toLowerCase().includes('hornpipe') || title.toLowerCase().includes('hp')) return 'Hornpipe';
  if (title.toLowerCase().includes('song')) return 'Song';
  if (title.toLowerCase().includes('set dance')) return 'Set Dance';
  if (title.toLowerCase().includes('polka')) return 'Polka';
  return 'Unknown';
};

const sanitizeTitleForFilename = (title) => {
  return title
    .replace(/\//g, '_')
    .replace(/:/g, '_')
    .replace(/\?/g, '_')
    .replace(/\(WC\)/g, '')
    .replace(/\(JC\)/g, '')
    .replace(/\(all\)/g, '')
    .replace(/\(/g, '')
    .replace(/\)/g, '')
    .replace(/'/g, '')
    .trim()
    .replace(/\s+/g, '_');
};

const original_track_data_raw = [
  ["1", "Reel Down the Broom", "00:00:01", "00:01:09"],
  ["1", "Reel Gatehouse Maid", "00:01:09", "00:01:49"],
  ["2", "Reel_ Coleman's Cross", "00:01:52", "00:03:20"],
  ["3", "Reels (2)_ Galway Rambler_Sheehan's (Wellington)", "00:03:24", "00:04:47"],
  ["4", "Reel_ McKenna's No.2", "00:04:49", "00:05:33"],
  ["5", "Reels (2)_ Old Bush_Galtee", "00:05:34", "00:07:44"],
  ["6", "Reels (2)_ Ladies Pantalettes_Collier's", "00:07:45", "00:09:17"],
  ["7", "Reel_ Micho Russell's", "00:09:20", "00:10:37"],
  ["8", "Reel_ Micho Russell's", "00:10:39", "00:11:33"],
  ["9", "Waltz_ Lovely Erin", "00:11:35", "00:13:14"],
  ["10", "Double Jig_ Four Poster Bed", "00:13:15", "00:14:43"],
  ["11", "Reel_ Spike Island Lasses", "00:14:46", "00:16:02"],
  ["12", "Reel_ Christmas Eve", "00:16:04", "00:17:14"],
  ["13", "Reel_ Christmas Eve (all)", "00:17:18", "00:19:16"],
  ["14", "Reel_ House on the Hill", "00:19:19", "00:21:02"],
  ["15", "Reel_ Trip to Durrow", "00:21:05", "00:21:41"],
  ["16", "Reel_ Rakish Paddy", "00:21:45", "00:23:08"],
  ["17", "Reel_ Sporting Nell", "00:23:10", "00:25:28"],
  ["18", "Reel_ Johnny Cronin's (WC)", "00:25:31", "00:27:03"],
  ["19", "Hornpipe_ Wicklow (WC)", "00:27:06", "00:29:45"],
  ["20", "Reel_ Rakish Paddy (WC)", "00:29:47", "00:31:29"],
  ["21", "Reel_ Green Fields of America", "00:31:30", "00:33:19"],
  ["22", "Reel_ Steampacket", "00:33:21", "00:34:53"],
  ["23", "Jig_ Rambling Pitchfork (WC)", "00:34:54", "00:36:24"],
  ["24", "Reel_ Flogging (WC)", "00:36:26", "00:38:10"],
  ["25", "Reel_ Morning Star (WC)", "00:38:13", "00:39:38"],
  ["26", "Reel_ Jenny Picking Cockles (WC)", "00:39:41", "00:41:15"],
  ["27", "Jig_ Piper's Chair (WC)", "00:41:18", "00:42:52"],
  ["28", "Reel_ Rolling in the Barrel (WC)", "00:42:54", "00:44:06"],
  ["29", "Jig_ Frieze Britches – fragment (WC)", "00:44:11", "00:44:40"],
  ["30", "Reel_ Heathery Breeze (WC)", "00:44:41", "00:45:12"],
  ["31", "Reel_ Fermoy Lasses", "00:45:13", "00:45:57"],
  ["32", "Jig_ Black Rogue", "00:46:00", "00:46:26"],
  ["33", "Reel_ Steampacket", "00:46:28", "00:47:55"],
  ["34", "Reel_ Humours of Lissadell", "00:47:56", "00:50:39"],
  ["35", "Reel_ Tim Maloney's", "00:50:40", "00:52:00"],
  ["36", "Polka_ Humours of Ballymote", "00:52:02", "00:52:53"],
  ["37", "Reel_ Bunch of Keys", "00:52:58", "00:53:56"],
  ["38", "Reel_ Flax in Bloom", "00:53:58", "00:55:22"],
  ["39", "Song_ My Charming ?", "00:55:24", "00:58:51"],
  ["40", "Reels (2)_ Miss McLeod's_Philip O'Beirne's Delight", "00:58:53", "01:02:19"],
  ["41", "Reel_ Gan ainm (JC)", "01:02:22", "01:03:53"],
  ["42", "Reel_ Sligo Maid (JC)", "01:04:07", "01:05:25"],
  ["43", "Set dance_ Bonaparte's Retreat (JC)", "01:05:27", "01:06:53"],
  ["44", "Song_ Little Fisher Boy", "01:06:54", "01:08:58"],
  ["45", "Reel_ Touch Me if You Dare", "01:08:59", "01:09:56"],
  ["46", "Reel_ Colonel Frazier's", "01:09:58", "01:11:46"],
  ["47", "Hp_ Gan ainm", "01:11:47", "01:14:25"],
  ["48", "Reel_ Liffey Banks", "01:14:28", "01:15:59"],
  ["49", "Reel_ College Groves", "01:16:01", "01:17:40"],
  ["50", "Reel_ Gan ainm", "01:17:42", "01:19:47"],
  ["51", "Reels (2)_ Wind that Shakes the Barley_Last Night's Fun", "01:19:50", "01:22:02"],
  ["52", "Reel_ Pigeon on the Gate (fragment)", "00:00:00", "00:00:20"],
  ["53", "Reel_ Christmas Eve", "01:22:24", "01:23:39"],
  ["54", "Reel_ Mountain Road", "01:23:42", "01:25:02"],
  ["55", "Reels (3)_ Tarbolton_Longford Collector_Sailor's Bonnet", "01:25:04", "01:28:09"],
];

const CUT_AUDIO_BASE_PATH = 'doolin_cuts/';
const DOOLIN_SESSION_LOCATION = "Doolin";
const DOOLIN_SESSION_YEAR = "1962";
const DOOLIN_SESSION_RECORDED_BY = "Joe Vaughan";
const DOOLIN_SESSION_DEFAULT_ARTISTS = "Micho Russell, Peadar O'Loughlin, Willie Shannon, Paddy Killourhy";

const existing = fs.existsSync(TUNES_FILE) ? JSON.parse(fs.readFileSync(TUNES_FILE, 'utf-8')) : {};
if (Object.keys(existing).length > 0) {
  console.log(`✓ Database already contains ${Object.keys(existing).length} tunes. Skipping seeding.`);
  process.exit(0);
}

console.log('🌱 Seeding database with 55 tunes...');

const tunesData = {};

let currentOriginalNumTracking = null;
let subIndex = 'a';

for (const trackRaw of original_track_data_raw) {
  const [original_num_raw, title, start_time_str, end_time_str] = trackRaw;

  let file_num_display = "";
  if (original_num_raw === currentOriginalNumTracking) {
    file_num_display = `${original_num_raw}${subIndex}`;
    subIndex = String.fromCharCode(subIndex.charCodeAt(0) + 1);
  } else {
    file_num_display = original_num_raw;
    currentOriginalNumTracking = original_num_raw;
    subIndex = 'a';
  }

  const numericPart = file_num_display.match(/\d+/)?.[0] || '';
  const alphaPart = file_num_display.match(/[a-zA-Z]+/)?.[0] || '';
  const paddedNumericPart = numericPart.padStart(2, '0');
  const finalFilePrefix = `${paddedNumericPart}${alphaPart}`;

  let artist = DOOLIN_SESSION_DEFAULT_ARTISTS;
  if (original_num_raw === "12" || original_num_raw === "44") {
    artist = "Micho Russell";
  } else if (original_num_raw === "40") {
    artist = "Paddy Killourhy";
  } else if (title.includes("(WC)")) {
    artist = "Willie Clancy";
  } else if (title.includes("(JC)")) {
    artist = "Joe Cuneen";
  }

  const cleanTitle = title.replace(/(\s\(WC\)|\s\(JC\)|\s\(all\))/g, '').trim();
  const safeTitleForUrl = sanitizeTitleForFilename(title);
  const audioFileName = `${finalFilePrefix}_${safeTitleForUrl}.mp3`;

  const startTime = timeToSeconds(start_time_str);
  const endTime = timeToSeconds(end_time_str);
  const duration = endTime - startTime;

  const tuneId = `doolin-${finalFilePrefix}`;
  tunesData[tuneId] = {
    id: tuneId,
    title: cleanTitle,
    artist: artist,
    source: `O'Connor's Bar, Doolin Session (Recorded by ${DOOLIN_SESSION_RECORDED_BY})`,
    region: DOOLIN_SESSION_LOCATION,
    key: '?',
    tuning: 'Standard',
    year: DOOLIN_SESSION_YEAR,
    audioUrl: `${CUT_AUDIO_BASE_PATH}${audioFileName}`,
    description: `Individual cut from the O'Connor's Bar session in Doolin, ${DOOLIN_SESSION_YEAR}. Features ${artist}.`,
    genre: getGenre(cleanTitle),
    startTime: 0,
    duration: duration,
    sourceCollection: "O'Connor's Bar Session, 1962",
    isImported: false,
    fileCutSource: true
  };
}

fs.writeFileSync(TUNES_FILE, JSON.stringify(tunesData, null, 2));

console.log('✓ Successfully seeded 55 tunes!');
