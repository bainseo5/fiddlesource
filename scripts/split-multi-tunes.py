"""
Split multi-tune audio files into individual tunes.

INSTRUCTIONS:
1. Listen to each audio file and note the timestamps where each tune starts/stops
2. Fill in the timestamps in the 'splits' section for each file
3. Run this script to split the audio files using ffmpeg
4. The script will create individual MP3 files for each tune
5. Then upload the new files to Cloudinary and update tunes.json

Format: "HH:MM:SS" or "MM:SS" or "SS"
Example: "00:01:05" = 1 minute 5 seconds, "01:05" = 1 minute 5 seconds, "65" = 65 seconds
"""

import subprocess
import os
import json

# Directory containing the original multi-tune audio files
output_dir = "../output"
# Directory for the split individual tune files
split_output_dir = "split-tunes"

# Multi-tune files that need to be split
# TODO: Fill in the timestamps for each tune after listening to the audio
multi_tune_splits = {
    # Mullagh Session Files
    "mullagh-01_Reels_2___Boys_of_Ballisodare_Hare_s_Paw.mp3": {
        "id": "mullagh-01",
        "splits": [
            # TODO: Add timestamps after listening
            # Example format:
            # {"title": "Boys of Ballisodare", "start": "00:00:00", "end": "00:01:05", "key": "D"},
            # {"title": "Hare's Paw", "start": "00:01:05", "end": "00:02:13", "key": "G"},
        ]
    },
    
    "mullagh-02_Reels_3___Mamma_s_Pet_Bloom_of_Youth_Heathery_Breeze.mp3": {
        "id": "mullagh-02",
        "splits": [
            # TODO: Add timestamps
            # {"title": "Mamma's Pet", "start": "00:00:00", "end": "00:01:00", "key": "?"},
            # {"title": "Bloom of Youth", "start": "00:01:00", "end": "00:02:00", "key": "?"},
            # {"title": "Heathery Breeze", "start": "00:02:00", "end": "00:03:10", "key": "?"},
        ]
    },
    
    "mullagh-03_Reels_3___Down_the_Broom_Gatehouse_Maid_Ivy_Leaf.mp3": {
        "id": "mullagh-03",
        "splits": [
            # TODO: Add timestamps
            # {"title": "Down the Broom", "start": "00:00:00", "end": "?", "key": "?"},
            # {"title": "Gatehouse Maid", "start": "?", "end": "?", "key": "?"},
            # {"title": "Ivy Leaf", "start": "?", "end": "?", "key": "?"},
        ]
    },
    
    "mullagh-04_Reels_2___Old_Torn_Petticoat_Green_Fields_of_America.mp3": {
        "id": "mullagh-04",
        "splits": [
            # TODO: Add timestamps
        ]
    },
    
    "mullagh-05_Reels_3___Kerry_Reel_Morning_Dew_Woman_of_the_House.mp3": {
        "id": "mullagh-05",
        "splits": [
            # TODO: Add timestamps
        ]
    },
    
    "mullagh-06_Jigs_2___Apples_in_Winter_Trip_to_Sligo.mp3": {
        "id": "mullagh-06",
        "splits": [
            # TODO: Add timestamps
        ]
    },
    
    "mullagh-07_Reels_2___Five_Mile_Chase_Abbey_Reel.mp3": {
        "id": "mullagh-07",
        "splits": [
            # TODO: Add timestamps
        ]
    },
    
    "mullagh-08_Reels_2___Jackie_Coleman_s_Bucks_of_Oranmore.mp3": {
        "id": "mullagh-08",
        "splits": [
            # TODO: Add timestamps
        ]
    },
    
    "mullagh-10_Reels_2___Shaskeen_Molloy_s_Favourite.mp3": {
        "id": "mullagh-10",
        "splits": [
            # TODO: Add timestamps
        ]
    },
    
    "mullagh-11_Reels_2___Paddy_Murphy_s_Wife_Stony_Steps.mp3": {
        "id": "mullagh-11",
        "splits": [
            # TODO: Add timestamps
        ]
    },
    
    "mullagh-13_Reels_3___Tarbolton_Longford_Collector_Sailor_s_Bonnet.mp3": {
        "id": "mullagh-13",
        "splits": [
            # TODO: Add timestamps
        ]
    },
    
    "mullagh-14_Reels_2___O_Rourke_s_Wild_Irishman.mp3": {
        "id": "mullagh-14",
        "splits": [
            # TODO: Add timestamps
        ]
    },
    
    "mullagh-16_Set_dances_2___Rodney_s_Glory_Mount_Famous_Hunt.mp3": {
        "id": "mullagh-16",
        "splits": [
            # TODO: Add timestamps
        ]
    },
    
    "mullagh-17_Reels_2___Green_Groves_of_Erin_Ivy_Leaf.mp3": {
        "id": "mullagh-17",
        "splits": [
            # TODO: Add timestamps
        ]
    },
    
    "mullagh-18_Jigs_2___Maid_in_the_Meadow_Rambling_Pitchfork.mp3": {
        "id": "mullagh-18",
        "splits": [
            # TODO: Add timestamps
        ]
    },
    
    # Bonavella Session Files
    "bonavella-01_Reels_2___Boys_of_Ballisodare_Hare_s_Paw_.mp3": {
        "id": "bonavella-01",
        "splits": [
            # TODO: Add timestamps
        ]
    },
    
    "bonavella-05_Jigs_2___Monk_s_Rambling_Pitchfork.mp3": {
        "id": "bonavella-05",
        "splits": [
            # TODO: Add timestamps
        ]
    },
    
    "bonavella-06_Jigs_2___Ask_my_Father_single_jig__Dusty_Miller_slip_jig_.mp3": {
        "id": "bonavella-06",
        "splits": [
            # TODO: Add timestamps
        ]
    },
    
    "bonavella-07_Reels_3___Hand_Me_Down_the_Tackle_Dublin_Silver_Spear.mp3": {
        "id": "bonavella-07",
        "splits": [
            # TODO: Add timestamps
        ]
    },
    
    "bonavella-10_Jig__Mist_Covered_Mountain_Garrett_Barry_s_.mp3": {
        "id": "bonavella-10",
        "splits": [
            # TODO: Add timestamps (this might be 1 or 2 tunes based on the "/" in title)
        ]
    },
    
    "bonavella-11_Reels_2___Dairy_Maid_Flax_in_Bloom.mp3": {
        "id": "bonavella-11",
        "splits": [
            # TODO: Add timestamps
        ]
    },
    
    # Doolin Session Files (from original cut.py)
    # Total duration from original session: 3.24-4.47 (83 seconds)
    "03_Reels_2___Galway_Rambler_Sheehan_s_Wellington_.mp3": {
        "id": "doolin-03",
        "splits": [
            # TODO: Listen to find where Galway Rambler ends and Sheehan's begins
            # Total file duration: ~83 seconds
            # {"title": "Galway Rambler", "start": "00:00:00", "end": "?", "key": "?"},
            # {"title": "Sheehan's (Wellington)", "start": "?", "end": "?", "key": "?"},
        ]
    },
    
    # Total duration from original session: 5.34-7.44 (130 seconds)
    "05_Reels_2___Old_Bush_Galtee.mp3": {
        "id": "doolin-05",
        "splits": [
            # TODO: Listen to find where Old Bush ends and Galtee begins
            # Total file duration: ~130 seconds (2:10)
            # {"title": "Old Bush", "start": "00:00:00", "end": "?", "key": "?"},
            # {"title": "Galtee", "start": "?", "end": "?", "key": "?"},
        ]
    },
    
    # Total duration from original session: 7.45-9.17 (92 seconds)
    "06_Reels_2___Ladies_Pantalettes_Collier_s.mp3": {
        "id": "doolin-06",
        "splits": [
            # TODO: Listen to find where Ladies Pantalettes ends and Collier's begins
            # Total file duration: ~92 seconds (1:32)
            # {"title": "Ladies Pantalettes", "start": "00:00:00", "end": "?", "key": "?"},
            # {"title": "Collier's", "start": "?", "end": "?", "key": "?"},
        ]
    },
    
    # Total duration from original session: 58.53-1.02.19 (206 seconds)
    "40_Reels_2___Miss_McLeod_s_Philip_O_Beirne_s_Delight.mp3": {
        "id": "doolin-40",
        "splits": [
            # TODO: Listen to find where Miss McLeod's ends and Philip O'Beirne's Delight begins
            # Total file duration: ~206 seconds (3:26)
            # Artist: Paddy Killourhy (fiddle solo)
            # {"title": "Miss McLeod's", "start": "00:00:00", "end": "?", "key": "?"},
            # {"title": "Philip O'Beirne's Delight", "start": "?", "end": "?", "key": "?"},
        ]
    },
    
    # Total duration from original session: 1.19.50-1.22.02 (132 seconds)
    "51_Reels_2___Wind_that_Shakes_the_Barley_Last_Night_s_Fun.mp3": {
        "id": "doolin-51",
        "splits": [
            # TODO: Listen to find where Wind that Shakes the Barley ends and Last Night's Fun begins
            # Total file duration: ~132 seconds (2:12)
            # {"title": "Wind that Shakes the Barley", "start": "00:00:00", "end": "?", "key": "?"},
            # {"title": "Last Night's Fun", "start": "?", "end": "?", "key": "?"},
        ]
    },
    
    # Total duration from original session: 1.25.04-1.28.09 (185 seconds)
    "55_Reels_3___Tarbolton_Longford_Collector_Sailor_s_Bonnet.mp3": {
        "id": "doolin-55",
        "splits": [
            # TODO: Listen to find where each tune transitions
            # Total file duration: ~185 seconds (3:05)
            # {"title": "Tarbolton", "start": "00:00:00", "end": "?", "key": "?"},
            # {"title": "Longford Collector", "start": "?", "end": "?", "key": "?"},
            # {"title": "Sailor's Bonnet", "start": "?", "end": "?", "key": "?"},
        ]
    },
}

def split_audio_file(input_path, output_path, start_time, end_time):
    """Use ffmpeg to split an audio file at specified timestamps."""
    command = [
        "ffmpeg", "-i", input_path,
        "-ss", start_time, "-to", end_time,
        "-c", "copy", output_path,
        "-y"  # Overwrite output files without asking
    ]
    subprocess.run(command)

def process_splits():
    """Process all multi-tune files and split them."""
    
    # Create output directory if it doesn't exist
    if not os.path.exists(split_output_dir):
        os.makedirs(split_output_dir)
    
    # Track new files for uploading to Cloudinary
    new_files_manifest = []
    
    for filename, metadata in multi_tune_splits.items():
        original_id = metadata["id"]
        splits = metadata.get("splits", [])
        
        if not splits:
            print(f"⚠️  Skipping {filename} - no timestamps defined yet")
            continue
        
        input_path = os.path.join(output_dir, filename)
        
        if not os.path.exists(input_path):
            print(f"❌ File not found: {input_path}")
            continue
        
        print(f"\n📀 Processing: {filename}")
        print(f"   Splitting into {len(splits)} individual tunes...")
        
        for i, split_info in enumerate(splits, 1):
            title = split_info["title"]
            start = split_info["start"]
            end = split_info["end"]
            key = split_info.get("key", "?")
            
            # Create safe filename
            safe_title = title.replace("/", "_").replace(":", "_").replace("?", "").strip()
            new_filename = f"{original_id}-{chr(96+i)}_{safe_title}.mp3"
            output_path = os.path.join(split_output_dir, new_filename)
            
            print(f"   {i}. {title} ({start} → {end})")
            split_audio_file(input_path, output_path, start, end)
            
            # Track for manifest
            new_files_manifest.append({
                "original_id": original_id,
                "new_filename": new_filename,
                "new_id": f"{original_id}-{chr(96+i)}",
                "title": title,
                "key": key,
                "start": start,
                "end": end
            })
    
    # Save manifest for reference
    with open("split-manifest.json", "w") as f:
        json.dump(new_files_manifest, f, indent=2)
    
    print(f"\n✅ Splitting complete!")
    print(f"   Created {len(new_files_manifest)} new audio files in '{split_output_dir}/'")
    print(f"   Manifest saved to 'split-manifest.json'")
    print(f"\nNext steps:")
    print(f"1. Upload the files in '{split_output_dir}/' to Cloudinary")
    print(f"2. Run the fetchCloudinaryUrls script to get the new URLs")
    print(f"3. Update tunes.json with the new individual tune entries")

if __name__ == "__main__":
    # Check if ffmpeg is available
    try:
        subprocess.run(["ffmpeg", "-version"], capture_output=True, check=True)
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("❌ Error: ffmpeg not found. Please install ffmpeg first.")
        print("   Download from: https://ffmpeg.org/download.html")
        exit(1)
    
    process_splits()
