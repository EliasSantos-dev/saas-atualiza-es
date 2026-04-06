import yt_dlp
import subprocess
import os

def download_and_process(query_or_url, final_output_path):
    """
    Downloads audio from a query or URL using yt-dlp and processes it with ffmpeg.
    Achieves 320kbps MP3 with EBU R128 loudness normalization.
    """
    # Temporary raw download path
    # yt-dlp might change the extension depending on the source format
    # We'll use a unique template to find it easily
    temp_base = final_output_path + ".raw"
    
    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': f"{temp_base}.%(ext)s",
        'quiet': True,
        'no_warnings': True,
        'extract_audio': True,
    }
    
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(query_or_url, download=True)
        # Find the actual downloaded file (yt-dlp might have used a different extension)
        ext = info.get('ext')
        temp_path = f"{temp_base}.{ext}"
        
    if not os.path.exists(temp_path):
        # Fallback if the extension logic failed
        # yt-dlp might have changed the extension during download (e.g. m4a to webm)
        # Let's search for any file starting with temp_base
        directory = os.path.dirname(final_output_path) or '.'
        base_name = os.path.basename(temp_base)
        for f in os.listdir(directory):
            if f.startswith(base_name):
                temp_path = os.path.join(directory, f)
                break
    
    if not os.path.exists(temp_path):
        raise RuntimeError(f"Failed to find downloaded file for {query_or_url}")

    # ffmpeg conversion to 320kbps MP3 + Audio Normalization (EBU R128)
    # -af loudnorm=I=-14:TP=-1.5:LRA=11 (Normalization)
    # -ab 320k (Bitrate)
    # -ar 44100 (Sample rate)
    cmd = [
        'ffmpeg', '-y', '-i', temp_path,
        '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11',
        '-ab', '320k', '-ar', '44100',
        final_output_path
    ]
    
    try:
        subprocess.run(cmd, check=True, capture_output=True)
    except subprocess.CalledProcessError as e:
        stderr = e.stderr.decode() if e.stderr else "Unknown error"
        raise RuntimeError(f"FFmpeg processing failed: {stderr}")
    finally:
        # Cleanup temp
        if os.path.exists(temp_path):
            os.remove(temp_path)
