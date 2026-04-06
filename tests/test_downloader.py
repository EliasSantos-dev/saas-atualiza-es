import os
import pytest
from unittest.mock import patch, MagicMock
from src.engine.downloader import download_and_process

@patch('src.engine.downloader.subprocess.run')
@patch('yt_dlp.YoutubeDL')
@patch('os.path.exists')
@patch('os.remove')
def test_download_and_process(mock_remove, mock_exists, mock_ytdlp, mock_subprocess):
    # Setup mocks
    mock_ydl_instance = MagicMock()
    mock_ydl_instance.extract_info.return_value = {'ext': 'webm'}
    mock_ytdlp.return_value.__enter__.return_value = mock_ydl_instance
    
    # Mock file existence for cleanup
    mock_exists.return_value = True
    
    query = "ytsearch:Artist - Song"
    output_path = "test_output.mp3"
    
    # Execute
    download_and_process(query, output_path)
    
    # Verify yt-dlp call
    mock_ytdlp.assert_called_once()
    mock_ydl_instance.extract_info.assert_called_once_with(query, download=True)
    
    # Verify ffmpeg call
    mock_subprocess.assert_called_once()
    args, kwargs = mock_subprocess.call_args
    cmd = args[0]
    assert 'ffmpeg' in cmd
    assert '-af' in cmd
    assert 'loudnorm=I=-14:TP=-1.5:LRA=11' in cmd
    assert '-ab' in cmd
    assert '320k' in cmd
    assert '-ar' in cmd
    assert '44100' in cmd
    
    # Verify cleanup
    mock_remove.assert_called_once()

@patch('src.engine.downloader.subprocess.run')
@patch('yt_dlp.YoutubeDL')
@patch('os.path.exists')
@patch('os.remove')
@patch('os.listdir')
def test_download_and_process_fallback(mock_listdir, mock_remove, mock_exists, mock_ytdlp, mock_subprocess):
    # Setup mocks
    mock_ydl_instance = MagicMock()
    # No extension in info
    mock_ydl_instance.extract_info.return_value = {}
    mock_ytdlp.return_value.__enter__.return_value = mock_ydl_instance
    
    # Mock exists: 
    # 1. First check (temp_path with missing ext) -> False
    # 2. After listdir find -> True
    # 3. Finally for cleanup -> True
    mock_exists.side_effect = [False, True, True]
    
    # Mock listdir to return a matching file
    mock_listdir.return_value = ["test_output.mp3.raw.webm"]
    
    query = "ytsearch:Artist - Song"
    output_path = "test_output.mp3"
    
    # Execute
    download_and_process(query, output_path)
    
    # Verify ffmpeg was called with the found file
    mock_subprocess.assert_called_once()
    args, _ = mock_subprocess.call_args
    cmd = args[0]
    # In Windows it might be test_output.mp3.raw.webm if path is relative
    assert any("test_output.mp3.raw.webm" in part for part in cmd)
