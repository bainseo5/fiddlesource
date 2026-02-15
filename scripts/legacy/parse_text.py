import re
import json

raw_text = """1. Reel: The Concert (U) (.01 - .35) 2. Reel: Catherine McEvoy's (MD) (.36 – 3.14) 3. Reel: Fermoy Lasses (unusual version) (MD) (3.16 – 5.56) 4. Reel: Copperplate (MD & U) (5.59 – 8.21) 5. Reel: The Ewe (MD & U) (8.23 – 9.24) 6. Set Dance: Mount Famous Hunt (MD) (9.25 – 12.27) 7. Hornpipe: Gan ainm (MD) (12.30 – 14.38) 8. Reel: Mason’s Apron (MD) (14.39 – 18.51) 9. Reel: Heathery Breeze (MD & U) (18.52 – 21.07) (no break between this and following tune) 10. Hornpipe: Boys of Bluehill (MD) (21.08 – 23.25) 11. Reel: Heathery Breeze (TC) (23.27 – 24.14) 12. Jig: Grey Goose (fragment only) (TC) (24.15 – 24.42) 13. Jig: Humours of Bandon (TC) (24.43 – 25.32) 14. Reel: Sporting Nell (TC) (25.34 – 26.36) 15. Set Dance: Mount Famous Hunt (TC) (26.37 – 27.58) 16. Reel: Spike Island Lasses (TC) (28.00 – 28.45) 17. Reel: Maid of Mount Kisko (fragment of first part only; tape runs out) (TC) (28.47 – 28.58)"""

# Clean up newlines and extra spaces
normalized_text = " ".join(raw_text.split())

# Use regex split with a lookahead for a track number followed by a Type (Capitalized word) to avoid splitting on timestamps.
# Tracks look like "1. Reel:", "6. Set Dance:", etc. 
# Matches 1 or 2 digits, dot, space, capitalized word
parts = re.split(r'\s+(?=\d+\.\s+[A-Z])', normalized_text)

clean_tracks = []
for part in parts:
    clean_part = part.strip()
    if clean_part:
        clean_tracks.append(clean_part)

print(json.dumps(clean_tracks, indent=2))
