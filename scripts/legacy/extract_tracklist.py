import requests
from bs4 import BeautifulSoup
import re
import json

url = "https://www.clarelibrary.ie/eolas/coclare/music/live/doyle_casey_JH15.htm"

try:
    response = requests.get(url)
    response.raise_for_status()
    
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # The tracks seem to be in a list or paragraphs. 
    # Based on the snippet, they might be just text in the body or p tags.
    # Let's look for text that matches the pattern "Number. Type: Name (Artist) (Time)"
    
    body_text = soup.get_text()
    
    # Regex to find the tracks
    # Example: 1. Reel: The Concert (U) (.01 - .35)
    # It seems to be formatted as: \d+\.\s+type:.*\(\d+
    
    # Let's just dump the text that looks like the list to inspect it first or try to capture it.
    # We can refine the regex.
    
    # Splits by lines and looks for lines starting with a number and a dot.
    lines = [line.strip() for line in body_text.splitlines() if line.strip()]
    
    tracks = []
    
    # Regex for a track line: Start with number, dot, space. Ends with closing parenthesis.
    # Note: The snippet showed run-on lines: "1. Reel... (.01 - .35)2. Reel..."
    # So we might need to handle that.
    
    # Taking the whole text and finding all matches
    text_content = soup.get_text(" ", strip=True) # Replace tags with space to avoid run-ons? 
    # Actually the previously returned snippet had run-ons like `(.35)2.` which suggests no space between them in the source or just how the summarizer presented it.
    # Let's try to regex search on the full text.
    
    # Pattern: \d+\.\s+.*?\(\d+[\.:]\d+\s*[–-]\s*\d+[\.:]\d+.*?\)(?=\d+\.|\Z)
    # Wait, the end timestamp might be complex.
    
    # Let's print the relevant part of the text first to see what we are dealing with.
    # We find "1. Reel: The Concert" and print roughly 2000 chars after it.
    
    start_marker = "1. Reel: The Concert"
    start_index = text_content.find(start_marker)
    
    if start_index != -1:
        print("Found start of list...")
        relevant_text = text_content[start_index:]
        # clean up a bit?
        print(relevant_text[:4000]) 
    else:
        print("Could not find start marker.")
        
except Exception as e:
    print(f"Error: {e}")
