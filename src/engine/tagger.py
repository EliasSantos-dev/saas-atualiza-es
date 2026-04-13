import requests
import os
from mutagen.mp3 import MP3
from mutagen.id3 import ID3, TIT2, TPE1, TALB, APIC, ID3NoHeaderError

def apply_metadata(file_path, metadata):
    """
    Applies ID3 metadata (Title, Artist, Album, Cover) to an MP3 file.
    """
    try:
        audio = MP3(file_path, ID3=ID3)
    except ID3NoHeaderError:
        audio = MP3(file_path)
        audio.add_tags()
    
    tags = audio.tags
    if tags is None:
        audio.add_tags()
        tags = audio.tags

    # Title
    if 'title' in metadata:
        tags.add(TIT2(encoding=3, text=metadata['title']))
    
    # Artist
    if 'artist' in metadata:
        tags.add(TPE1(encoding=3, text=metadata['artist']))
    
    # Album
    if 'album' in metadata:
        tags.add(TALB(encoding=3, text=metadata['album']))
    elif 'artist' in metadata:
        # Fallback to Artist if Album is missing
        tags.add(TALB(encoding=3, text=metadata['artist']))
    
    # Cover Image
    if 'cover_url' in metadata and metadata['cover_url']:
        try:
            # Check if it's a local file or a URL
            if metadata['cover_url'].startswith(('http://', 'https://')):
                response = requests.get(metadata['cover_url'], timeout=15)
                if response.status_code == 200:
                    image_data = response.content
                    mime = 'image/jpeg' if 'jpeg' in response.headers.get('Content-Type', '').lower() or 'jpg' in metadata['cover_url'].lower() else 'image/png'
                else:
                    image_data = None
            else:
                # Local file
                if os.path.exists(metadata['cover_url']):
                    with open(metadata['cover_url'], 'rb') as f:
                        image_data = f.read()
                    mime = 'image/jpeg' if metadata['cover_url'].lower().endswith(('.jpg', '.jpeg')) else 'image/png'
                else:
                    image_data = None

            if image_data:
                tags.add(APIC(
                    encoding=3,
                    mime=mime,
                    type=3, # Front cover
                    desc=u'Cover',
                    data=image_data
                ))
        except Exception as e:
            print(f"Warning: Failed to apply cover image from {metadata['cover_url']}: {e}")
            
    audio.save()

if __name__ == "__main__":
    # Small test if run directly
    import os
    import sys
    if len(sys.argv) > 1:
        path = sys.argv[1]
        if os.path.exists(path):
            test_meta = {
                "title": "Test Title",
                "artist": "Test Artist",
                "album": "Test Album"
            }
            apply_metadata(path, test_meta)
            print(f"Applied metadata to {path}")
