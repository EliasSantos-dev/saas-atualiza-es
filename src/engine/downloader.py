import yt_dlp
import subprocess
import os
from src.engine.tagger import apply_metadata

def download_and_process(query_or_url, final_output_path, metadata=None):
    temp_base = final_output_path + ".temp"
    
    # Silencia o yt-dlp, exceto erros
    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': f"{temp_base}.%(ext)s",
        'quiet': True,
        'no_warnings': True,
        'extract_audio': True,
    }
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(query_or_url, download=True)
            ext = info.get('ext')
            temp_path = f"{temp_base}.{ext}"
            
        if not os.path.exists(temp_path):
            directory = os.path.dirname(final_output_path) or '.'
            for f in os.listdir(directory):
                if f.startswith(os.path.basename(temp_base)):
                    temp_path = os.path.join(directory, f)
                    break
        
        # FFmpeg silencioso (apenas erros)
        cmd = [
            'ffmpeg', '-y', '-hide_banner', '-loglevel', 'error',
            '-i', temp_path,
            '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11',
            '-ab', '320k', '-ar', '44100',
            final_output_path
        ]
        
        subprocess.run(cmd, check=True, capture_output=True)
        
        if metadata:
            apply_metadata(final_output_path, metadata)
            
    except Exception as e:
        print(f" [!] Erro no processamento: {str(e)[:50]}...")
        raise
    finally:
        if 'temp_path' in locals() and os.path.exists(temp_path):
            os.remove(temp_path)
