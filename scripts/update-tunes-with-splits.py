"""
Update tunes.json with split individual tunes.

This script:
1. Reads the split-manifest.json created by split-multi-tunes.py
2. Loads the original tune metadata from tunes.json
3. Creates new entries for each individual tune
4. Updates tunes.json with the new entries
5. Optionally removes or marks the old multi-tune entries

Run this AFTER:
1. Running split-multi-tunes.py to split the audio
2. Uploading the new split files to Cloudinary
3. Running fetchCloudinaryUrls.js to get the new URLs
"""

import json
import os
from datetime import datetime

# Paths
manifest_path = "split-manifest.json"
tunes_path = "../backend/data/tunes.json"
backup_path = f"../backend/data/tunes.backup-before-split-{datetime.now().strftime('%Y%m%d-%H%M%S')}.json"

def load_json(filepath):
    """Load JSON file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(filepath, data):
    """Save JSON file with formatting."""
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

def update_tunes_with_splits(keep_original=False):
    """
    Update tunes.json with individual split tunes.
    
    Args:
        keep_original: If True, keep the original multi-tune entries marked as deprecated
                      If False, remove the original multi-tune entries
    """
    
    # Load data
    if not os.path.exists(manifest_path):
        print(f"❌ Manifest file not found: {manifest_path}")
        print("   Run split-multi-tunes.py first!")
        return
    
    manifest = load_json(manifest_path)
    tunes = load_json(tunes_path)
    
    # Create backup
    save_json(backup_path, tunes)
    print(f"✅ Backup created: {backup_path}")
    
    # Track changes
    new_tunes_count = 0
    updated_original_count = 0
    
    # Process each split tune
    for split in manifest:
        original_id = split['original_id']
        new_id = split['new_id']
        new_title = split['title']
        new_key = split['key']
        
        # Get original tune metadata
        if original_id not in tunes:
            print(f"⚠️  Warning: Original tune {original_id} not found in tunes.json")
            continue
        
        original_tune = tunes[original_id]
        
        # Create new tune entry based on original
        new_tune = original_tune.copy()
        new_tune['id'] = new_id
        new_tune['title'] = f"Reel {new_title}" if "Reel" in original_tune['title'] else new_title
        new_tune['key'] = new_key
        
        # Note: audioUrl will need to be updated after uploading to Cloudinary
        # For now, we'll mark it as needing update
        new_tune['audioUrl'] = f"NEEDS_UPDATE_{new_id}"
        
        # Add note about being split from multi-tune file
        new_tune['description'] = original_tune.get('description', '') + f" Split from multi-tune recording."
        
        # Mark as individual tune (not multi-tune anymore)
        new_tune['isMultiTune'] = False
        
        # Add to tunes
        tunes[new_id] = new_tune
        new_tunes_count += 1
        print(f"✅ Created new entry: {new_id} - {new_title}")
    
    # Handle original multi-tune entries
    original_ids = set(split['original_id'] for split in manifest)
    for original_id in original_ids:
        if original_id in tunes:
            if keep_original:
                # Mark as deprecated but keep
                tunes[original_id]['deprecated'] = True
                tunes[original_id]['deprecatedReason'] = "Split into individual tunes"
                print(f"⚠️  Marked as deprecated: {original_id}")
                updated_original_count += 1
            else:
                # Remove the original multi-tune entry
                del tunes[original_id]
                print(f"🗑️  Removed original: {original_id}")
                updated_original_count += 1
    
    # Save updated tunes
    save_json(tunes_path, tunes)
    
    print(f"\n✅ Update complete!")
    print(f"   Created {new_tunes_count} new individual tune entries")
    print(f"   {'Marked' if keep_original else 'Removed'} {updated_original_count} original multi-tune entries")
    print(f"\n⚠️  IMPORTANT: Audio URLs need to be updated!")
    print(f"   1. Upload the split files from 'split-tunes/' to Cloudinary")
    print(f"   2. Run ../backend/fetchCloudinaryUrls.js to fetch the new URLs")
    print(f"   3. The script will automatically update all 'NEEDS_UPDATE_*' URLs")

if __name__ == "__main__":
    print("Update tunes.json with split individual tunes")
    print("-" * 50)
    
    # Ask user preference
    print("\nDo you want to keep the original multi-tune entries?")
    print("  1. Keep original entries (mark as deprecated)")
    print("  2. Remove original entries (recommended)")
    
    choice = input("\nEnter choice (1 or 2, default=2): ").strip() or "2"
    
    keep_original = choice == "1"
    
    print()
    update_tunes_with_splits(keep_original=keep_original)
