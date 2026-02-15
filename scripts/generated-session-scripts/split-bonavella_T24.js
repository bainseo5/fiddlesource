/**
 * Script to split session: bonavella_T24
 * Source: https://www.clarelibrary.ie/eolas/coclare/music/live/bonavella_T24.htm
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const execPromise = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// TODO: Update to point to the actual downloaded MP3 file
const SOURCE_FILE = String.raw`C:\Users\andre\Documents\tunes\tunes\scripts\archive\MISSING_FILE_bonavella_T24.mp3`;
const OUTPUT_DIR = path.join(__dirname, '../output');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function parseTime(timeStr) {
  if (!timeStr || timeStr === 'TBD') return null;
  // Format could be .02, 1.45, 1.05.33
  // Normalize to 0.02 if .02
  let cleanTime = timeStr.toString().trim();
  if (cleanTime.startsWith('.')) cleanTime = '0' + cleanTime;
  
  const parts = cleanTime.split('.');
  
  if (parts.length === 3) {
      // H.MM.SS
      const h = parseInt(parts[0]) || 0;
      const m = parseInt(parts[1]) || 0;
      const s = parseInt(parts[2]) || 0;
      return h * 3600 + m * 60 + s;
  }
  
  if (parts.length === 2) {
      // MM.SS
      const m = parseInt(parts[0]) || 0;
      const s = parseInt(parts[1]) || 0;
      return m * 60 + s;
  }
  
  if (parts.length === 1) {
      return parseInt(cleanTime);
  }
  
  return 0;
}

const sessionInfo = {
  location: "Crehans&#",
  musicians: "Cissie Crehan Bonavella, Mullagh",
  date: "8217",
  collection: "Barry Taylor Collection",
  recordingType: "Session",
  sourceUrl: "https://www.clarelibrary.ie/eolas/coclare/music/live/bonavella_T24.htm"
};

const tracks = [
  {
    "id": "bonavella_T24-1",
    "title": "Sporting Nell (The Long Strand)",
    "genre": "Reel",
    start: '.29',
    end: '1.32'
  },
  {
    "id": "bonavella_T24-2",
    "title": "Talk about learning tunes from Scully Casey; comparison with Thady Casey",
    "genre": "Tune",
    start: '1.38',
    end: '2.37'
  },
  {
    "id": "bonavella_T24-3a",
    "title": "Old Torn Petticoat",
    "genre": "Reel",
    start: '2.40',
    end: 'TBD'
  },
  {
    "id": "bonavella_T24-3b",
    "title": "Green Fields of America",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "bonavella_T24-3c",
    "title": "Rakish Paddy",
    "genre": "Reel",
    start: 'TBD',
    end: '6.15'
  },
  {
    "id": "bonavella_T24-4",
    "title": "Talking about item 3; playing with Johnny Doran at fair in Kilmihil; Johnny Doran playing at fairs and platforms; more feeling in Willie Clancy&#8217;s music; Junior would as well play an air as a reel or jig",
    "genre": "Reel",
    start: '6.18',
    end: '9.30'
  },
  {
    "id": "bonavella_T24-5",
    "title": "Air: A St&oacute;r Mo Chro&iacute;",
    "genre": "Tune",
    start: '9.37',
    end: '11.30'
  },
  {
    "id": "bonavella_T24-6",
    "title": "Talk about item 5; tries to express song",
    "genre": "Song",
    start: '11.31',
    end: '12.00'
  },
  {
    "id": "bonavella_T24-7",
    "title": "Air: Anach Cuain",
    "genre": "Tune",
    start: '12.02',
    end: '14.09'
  },
  {
    "id": "bonavella_T24-8",
    "title": "Story of &#8216;Anach Cuain&#8217;; used to hear songs from old people; Irish language in his area; no Irish taught in his day &#8211; when inspector came, books would be put away; Junior finished school in 1922",
    "genre": "Song",
    start: '14.12',
    end: '18.17'
  },
  {
    "id": "bonavella_T24-9",
    "title": "Talk about how Junior learned the fiddle; first tune &#8216;Wearing of the Green&#8217;; meeting Thady Casey at Crosses of Annagh; meeting Scully Casey and listening to Scully play; Junior brought more tunes to Scully than he got from Scully; Scully was very quick to learn from records; location of Thady Casey&#8217;s house; Thady was a great step dancer and had the hardest dance in the world; ran dancing school in the winter; Paddy Boohan was a great dancer; similarity between Junior and Bobby Casey&#8217;s styles; Bobby does more with the bow",
    "genre": "Tune",
    start: '18.18',
    end: '26.10'
  },
  {
    "id": "bonavella_T24-10",
    "title": "Scully Casey&#8217;s (Billy O&#8217;Donnell&#8217;s)",
    "genre": "Jig",
    start: '26.56',
    end: '28.12'
  },
  {
    "id": "bonavella_T24-11",
    "title": "Humours of Bandon",
    "genre": "Set Dance",
    start: '28.18',
    end: '30.21'
  },
  {
    "id": "bonavella_T24-12",
    "title": "Talk about item 11; Junior&#8217;s relaxed slow style; Casey used to play&#8217; slow and solid&#8217; &#8211; quicker for the dance",
    "genre": "Tune",
    start: '30.22',
    end: '31.25'
  },
  {
    "id": "bonavella_T24-13a",
    "title": "Pigeon on the Gate",
    "genre": "Reel",
    start: '31.28',
    end: 'TBD'
  },
  {
    "id": "bonavella_T24-13b",
    "title": "Toss the Feathers (played as for dancing)",
    "genre": "Reel",
    start: 'TBD',
    end: '33.12'
  },
  {
    "id": "bonavella_T24-14",
    "title": "Toss the Feathers (Scully&#8217;s version)",
    "genre": "Reel",
    start: '33.29',
    end: '34.33'
  },
  {
    "id": "bonavella_T24-15",
    "title": "Talking about 78 records; got &#8216;the world of tunes from records;&#8217; listened to the radio; learning tunes from travelling fiddlers at fairs; 2 people learning one tune: 1 with the first part, etc., Scully Casey learning tunes from records; going to country house dances; people coming home from America wanting Junior to play at different houses; dancing in the kitchen, with up to 100 people; house dance held for brother from USA attended by possibly 200 people; threshing corn in the kitchen using a flail",
    "genre": "Tune",
    start: '34.36',
    end: '41.06'
  },
  {
    "id": "bonavella_T24-16",
    "title": "Hard times during &#8216;Economic War&#8217;; organising money-raising dance",
    "genre": "Tune",
    start: '41.11',
    end: '41.58'
  },
  {
    "id": "bonavella_T24-17",
    "title": "Ban on house dances; charging tax on dances; dances in halls, big bands; music nearly died out; emigration; Junior devastated; start of Comhaltas; (Cissie Crehan: 150 at house dance; drink your tea)",
    "genre": "Tune",
    start: '42.09',
    end: '44.42'
  },
  {
    "id": "bonavella_T24-18",
    "title": "(Interference from TV) house dances &#8211; it was at house dances where we learned to play",
    "genre": "Tune",
    start: '44.43',
    end: '45.42'
  },
  {
    "id": "bonavella_T24-19",
    "title": "House dances great way to learn tunes; &#8216;You&#8217;d hear the music the following in the breeze &#8211; in the wind from the night before&#8217;; young lads would be listening to the 2 Caseys play together; beetles in house are sign of bad weather (distortion on tape)",
    "genre": "Tune",
    start: '45.44',
    end: '47.45'
  },
  {
    "id": "bonavella_T24-20",
    "title": "Old players reluctant to share music; how he got &#8216;The Drunken Gauger&#8217; from Pat Barron (tape ends)",
    "genre": "Tune",
    start: '47.48',
    end: '50.01'
  },
  {
    "id": "bonavella_T24-21",
    "title": "Blackbird (Cissie talking at start)",
    "genre": "Set Dance",
    start: '50.22',
    end: '52.24'
  },
  {
    "id": "bonavella_T24-22",
    "title": "Talk about set dancing",
    "genre": "Tune",
    start: '52.32',
    end: '53.23'
  },
  {
    "id": "bonavella_T24-23",
    "title": "Mount Famous Hunt",
    "genre": "Set Dance",
    start: '53.38',
    end: '55.44'
  },
  {
    "id": "bonavella_T24-24",
    "title": "Drunken Gauger",
    "genre": "Set Dance",
    start: '56.12',
    end: '58.02'
  },
  {
    "id": "bonavella_T24-25",
    "title": "Talk about dance for item 24 &#8211; jig time but like a person staggering",
    "genre": "Jig",
    start: '58.06',
    end: '58.30'
  },
  {
    "id": "bonavella_T24-26",
    "title": "Rodney&#8217;s Glory",
    "genre": "Set Dance",
    start: '58.38',
    end: '1.00.00'
  },
  {
    "id": "bonavella_T24-27",
    "title": "Use of double stopping &#8211; demonstration by Junior; top of the finger turned, so doesn&#8217;t reach up enough",
    "genre": "Tune",
    start: '1.52.00',
    end: '1.02.19'
  },
  {
    "id": "bonavella_T24-28a",
    "title": "Hills of Lachine",
    "genre": "Jig",
    start: '1.02.21',
    end: 'TBD'
  },
  {
    "id": "bonavella_T24-28b",
    "title": "Maid in the Meadow",
    "genre": "Jig",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "bonavella_T24-28c",
    "title": "Humours of Donnybrook",
    "genre": "Jig",
    start: 'TBD',
    end: '1.05.45'
  },
  {
    "id": "bonavella_T24-29",
    "title": "Kerry music; all slides and polkas for the Plain Set; jigs and reels for Caledonian; 5 or 6 musicians for a country house dance &#8211; sometimes ten!; fiddles, flutes and concertina &#8211; no guitars; melodeons but not accordions",
    "genre": "Reel",
    start: '1.05.45',
    end: '1.07.47'
  },
  {
    "id": "bonavella_T24-30a",
    "title": "Stack of Wheat",
    "genre": "Hornpipe",
    start: '1.08.07',
    end: 'TBD'
  },
  {
    "id": "bonavella_T24-30b",
    "title": "Bantry Bay",
    "genre": "Hornpipe",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "bonavella_T24-30c",
    "title": "Stream of the Cats",
    "genre": "Hornpipe",
    start: 'TBD',
    end: '1.11.08'
  },
  {
    "id": "bonavella_T24-31",
    "title": "Names tunes in item 30",
    "genre": "Tune",
    start: '1.11.15',
    end: '1.11.28'
  },
  {
    "id": "bonavella_T24-32",
    "title": "Air: Priest&#8217;s Lament",
    "genre": "Tune",
    start: '1.11.31',
    end: '1.13.45'
  },
  {
    "id": "bonavella_T24-33",
    "title": "Story: Priest&#8217;s Lament",
    "genre": "Tune",
    start: '1.14.01',
    end: '1.18.18'
  },
  {
    "id": "bonavella_T24-34",
    "title": "Talk about &#8216;Kerry Woman&#8217;s Lament&#8217;",
    "genre": "Tune",
    start: '1.18.21',
    end: '1.19.01'
  },
  {
    "id": "bonavella_T24-35",
    "title": "Caisle&aacute;n an &Oacute;ir",
    "genre": "Hornpipe",
    start: '1.19.03',
    end: '1.19.55'
  },
  {
    "id": "bonavella_T24-36",
    "title": "Mist Covered Mountain",
    "genre": "Jig",
    start: '1.20.09',
    end: '1.21.29'
  },
  {
    "id": "bonavella_T24-37",
    "title": "Dance: An Gabhair&iacute;n Bu&iacute;",
    "genre": "Tune",
    start: '1.21.59',
    end: '1.22.58'
  },
  {
    "id": "bonavella_T24-38",
    "title": "Talk about dance",
    "genre": "Tune",
    start: '1.22.59',
    end: '1.23.28'
  },
  {
    "id": "bonavella_T24-39a",
    "title": "Steam Packet (?)",
    "genre": "Reel",
    start: '1.23.51',
    end: 'TBD'
  },
  {
    "id": "bonavella_T24-39b",
    "title": "Over the Moors to Maggie",
    "genre": "Reel",
    start: 'TBD',
    end: '1.26.54'
  },
  {
    "id": "bonavella_T24-40",
    "title": "Ships Are Sailing",
    "genre": "Reel",
    start: '1.27.20',
    end: '1.28.43'
  },
  {
    "id": "bonavella_T24-41",
    "title": "Talk about local fiddle players Paddy Galvin, Michael Downes",
    "genre": "Tune",
    start: '1.28.44',
    end: '1.30.55'
  }
];

async function main() {
  console.log('Processing Session: bonavella_T24');
  
  const tunes = [];

  for (const track of tracks) {
    if (track.start === 'TBD' || track.end === 'TBD') {
      console.log(`Skipping ${track.title} (timestamps TBD)`);
      continue;
    }

    const startSec = parseTime(track.start);
    const endSec = parseTime(track.end);

    if (startSec === null || endSec === null) {
         console.log(`Skipping ${track.title} (invalid time format)`);
         continue;
    }

    const duration = endSec - startSec;
    if (duration <= 0) {
        console.log(`Skipping ${track.title} (negative/zero duration)`);
        continue;
    }

    const outputFile = path.join(OUTPUT_DIR, `${track.id}.mp3`);
    // ffmpeg command - using copy to keyframe might be inaccurate but fast. 
    // re-encoding is safer for precision but lossy. 
    // User requested "easy" style which uses copy.
    const cmd = `ffmpeg -i "${SOURCE_FILE}" -ss ${startSec} -t ${duration} -c copy -y "${outputFile}"`;
    
    try {
      console.log(`Processing: ${track.title} (${track.start} - ${track.end})`);
      await execPromise(cmd);
      
      
      // ENHANCED METADATA SCHEMA
      tunes.push({
        id: track.id,
        title: track.title,
        genre: 'Irish Traditional',
        type: track.genre, // Maps 'Reel'/'Jig' to type
        url: `/audio/${track.id}.mp3`,
        source: sessionInfo.location,
        musicians: sessionInfo.musicians,
        artist: sessionInfo.artist || sessionInfo.musicians,
        date: sessionInfo.date,
        year: sessionInfo.date ? sessionInfo.date.slice(-4) : "Unknown", // Attempt to extract year
        collection: sessionInfo.collection,
        sourceCollection: sessionInfo.collection, 
        region: sessionInfo.region || "County Clare", // Default if missing
        recordingType: sessionInfo.recordingType || 'session',
        description: `Recorded at ${sessionInfo.location} on ${sessionInfo.date}.
Musicians: ${sessionInfo.musicians}.
Part of ${sessionInfo.collection}.`,
        isImported: true
      });
    } catch (err) {
      console.error(`Error processing ${track.title}:`, err.message);
    }
  }

  const jsonPath = path.join(OUTPUT_DIR, 'bonavella_T24-tunes.json');
  fs.writeFileSync(jsonPath, JSON.stringify(tunes, null, 2));
  console.log(`Wrote metadata to ${jsonPath}`);
}

main().catch(console.error);
