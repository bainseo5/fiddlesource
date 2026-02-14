import subprocess
import os

# Configuration
input_file = "archive/T85_Doolin_1962_KLICKAUD.mp3"
output_dir = "output"

# Global Session Metadata
SESSION_LOCATION = "O’Connor’s Bar, Doolin"
SESSION_YEAR = "1962"
SESSION_RECORDED_BY = "Joe Vaughan"
# Default artists for tracks not specifically attributed from the Doolin session
DEFAULT_ARTISTS = "Micho Russell, Peadar O’Loughlin, Willie Shannon, Paddy Killourhy"


# Original track list with original numbering, title, start, and end times
original_track_data_raw = [
    ("1", "Reel Down the Broom", "00:00:01", "00:01:09"),
    ("1", "Reel Gatehouse Maid", "00:01:09", "00:01:49"),
    ("2", "Reel_ Coleman's Cross", "00:01:52", "00:03:20"),
    ("3", "Reels (2)_ Galway Rambler_Sheehan’s (Wellington)", "00:03:24", "00:04:47"),
    ("4", "Reel_ McKenna's No.2", "00:04:49", "00:05:33"),
    ("5", "Reels (2)_ Old Bush_Galtee", "00:05:34", "00:07:44"),
    ("6", "Reels (2)_ Ladies Pantalettes_Collier’s", "00:07:45", "00:09:17"),
    ("7", "Reel_ Micho Russell's", "00:09:20", "00:10:37"),
    ("8", "Reel_ Micho Russell's", "00:10:39", "00:11:33"),
    ("9", "Waltz_ Lovely Erin", "00:11:35", "00:13:14"),
    ("10", "Double Jig_ Four Poster Bed", "00:13:15", "00:14:43"),
    ("11", "Reel_ Spike Island Lasses", "00:14:46", "00:16:02"),
    ("12", "Reel_ Christmas Eve", "00:16:04", "00:17:14"),
    ("13", "Reel_ Christmas Eve (all)", "00:17:18", "00:19:16"),
    ("14", "Reel_ House on the Hill", "00:19:19", "00:21:02"),
    ("15", "Reel_ Trip to Durrow", "00:21:05", "00:21:41"),
    ("16", "Reel_ Rakish Paddy", "00:21:45", "00:23:08"),
    ("17", "Reel_ Sporting Nell", "00:23:10", "00:25:28"),
    ("18", "Reel_ Johnny Cronin's (WC)", "00:25:31", "00:27:03"),
    ("19", "Hornpipe_ Wicklow (WC)", "00:27:06", "00:29:45"),
    ("20", "Reel_ Rakish Paddy (WC)", "00:29:47", "00:31:29"),
    ("21", "Reel_ Green Fields of America", "00:31:30", "00:33:19"),
    ("22", "Reel_ Steampacket", "00:33:21", "00:34:53"),
    ("23", "Jig_ Rambling Pitchfork (WC)", "00:34:54", "00:36:24"),
    ("24", "Reel_ Flogging (WC)", "00:36:26", "00:38:10"),
    ("25", "Reel_ Morning Star (WC)", "00:38:13", "00:39:38"),
    ("26", "Reel_ Jenny Picking Cockles (WC)", "00:39:41", "00:41:15"),
    ("27", "Jig_ Piper's Chair (WC)", "00:41:18", "00:42:52"),
    ("28", "Reel_ Rolling in the Barrel (WC)", "00:42:54", "00:44:06"),
    ("29", "Jig_ Frieze Britches – fragment (WC)", "00:44:11", "00:44:40"),
    ("30", "Reel_ Heathery Breeze (WC)", "00:44:41", "00:45:12"),
    ("31", "Reel_ Fermoy Lasses", "00:45:13", "00:45:57"),
    ("32", "Jig_ Black Rogue", "00:46:00", "00:46:26"),
    ("33", "Reel_ Steampacket", "00:46:28", "00:47:55"),
    ("34", "Reel_ Humours of Lissadell", "00:47:56", "00:50:39"),
    ("35", "Reel_ Tim Maloney's", "00:50:40", "00:52:00"),
    ("36", "Polka_ Humours of Ballymote", "00:52:02", "00:52:53"),
    ("37", "Reel_ Bunch of Keys", "00:52:58", "00:53:56"),
    ("38", "Reel_ Flax in Bloom", "00:53:58", "00:55:22"),
    ("39", "Song_ My Charming ?", "00:55:24", "00:58:51"),
    ("40", "Reels (2)_ Miss McLeod’s_Philip O'Beirne's Delight", "00:58:53", "01:02:19"),
    ("41", "Reel_ Gan ainm (JC)", "01:02:22", "01:03:53"),
    ("42", "Reel_ Sligo Maid (JC)", "01:04:07", "01:05:25"),
    ("43", "Set dance_ Bonaparte's Retreat (JC)", "01:05:27", "01:06:53"),
    ("44", "Song_ Little Fisher Boy", "01:06:54", "01:08:58"),
    ("45", "Reel_ Touch Me if You Dare", "01:08:59", "01:09:56"),
    ("46", "Reel_ Colonel Frazier's", "01:09:58", "01:11:46"),
    ("47", "Hp_ Gan ainm", "01:11:47", "01:14:25"),
    ("48", "Reel_ Liffey Banks", "01:14:28", "01:15:59"),
    ("49", "Reel_ College Groves", "01:16:01", "01:17:40"),
    ("50", "Reel_ Gan ainm", "01:17:42", "01:19:47"),
    ("51", "Reels (2)_ Wind that Shakes the Barley_Last Night’s Fun", "01:19:50", "01:22:02"),
    ("52", "Reel_ Pigeon on the Gate (fragment)", "01:22:02", "01:22:22"),
    ("53", "Reel_ Christmas Eve", "01:22:24", "01:23:39"),
    ("54", "Reel_ Mountain Road", "01:23:42", "01:25:02"),
    ("55", "Reels (3)_ Tarbolton_Longford Collector_Sailor’s Bonnet", "01:25:04", "01:28:09"),
]

# Process tracks to add metadata and a unique sequential file numbering for output
tracks = []
current_original_num_tracking = None
sub_index = 'a'

for i, (original_num_raw, title, start, end) in enumerate(original_track_data_raw):
    # Determine the file number prefix (e.g., "01", "01a", "01b", "02")
    file_num_prefix = ""
    if original_num_raw == current_original_num_tracking:
        file_num_prefix = f"{original_num_raw}{sub_index}"
        sub_index = chr(ord(sub_index) + 1)
    else:
        file_num_prefix = original_num_raw
        current_original_num_tracking = original_num_raw
        sub_index = 'a' # Reset sub-index for a new original_num_raw

    # Ensure two-digit padding for the numeric part of the prefix
    numeric_part = "".join(filter(str.isdigit, file_num_prefix))
    alpha_part = "".join(filter(str.isalpha, file_num_prefix))
    padded_numeric_part = numeric_part.zfill(2)
    final_file_prefix = f"{padded_numeric_part}{alpha_part}"

    # Determine artist based on specific instructions
    artist = DEFAULT_ARTISTS
    if original_num_raw in ["12", "44"]: # Items 12 & 44: Micho Russell
        artist = "Micho Russell"
    elif original_num_raw == "40": # Item 40: Paddy Killourhy, fiddle solo
        artist = "Paddy Killourhy"
    elif "(WC)" in title: # Items marked (WC) include Willie Clancy
        artist = "Willie Clancy"
    elif "(JC)" in title: # Items marked (JC) include Joe Cuneen
        artist = "Joe Cuneen"
    
    tracks.append({
        "file_num_display": final_file_prefix, # For filename prefix and display
        "original_num": original_num_raw,      # For reference to original grouping
        "title": title,
        "artist": artist,
        "start": start,
        "end": end,
        "location": SESSION_LOCATION,
        "year": SESSION_YEAR,
        "recorded_by": SESSION_RECORDED_BY
    })

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

for track in tracks:
    num = track["file_num_display"]
    title = track["title"]
    start = track["start"]
    end = track["end"]
    
    # Sanitize title for filename by removing specific tags and characters
    safe_title = title.replace("/", "_").replace(":", "_").replace("?", "_") \
                      .replace("(WC)", "").replace("(JC)", "").replace("(all)", "") \
                      .replace("(", "").replace(")", "").replace("’", "").strip()
    
    output_filename = f"{num}_{safe_title}.mp3"
    output_path = os.path.join(output_dir, output_filename)
    
    command = [
        "ffmpeg", "-i", input_file,
        "-ss", start, "-to", end,
        "-c", "copy", output_path,
        "-y" # Overwrite output files without asking
    ]
    
    print(f"Cutting track {track['file_num_display']} (Original source item: {track['original_num']}): {track['title']} by {track['artist']} from {track['location']}, {track['year']} (Recorded by {track['recorded_by']}) ({start} - {end})")
    subprocess.run(command)

print("Finished cutting tracks.")