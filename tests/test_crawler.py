from src.engine.crawler import parse_spotify_playlist_html

def test_parse_spotify_playlist_html():
    html = """
    <div data-testid="tracklist-row">
        <div dir="auto" class="Type__TypeElement-sc-goli3j-0 bDHxRN t_yrXoUO3qGsJS4Y6iXX standalone-ellipsis-one-line" data-encore-id="type">Song A</div>
        <a dir="auto" href="/artist/123" class="Type__TypeElement-sc-goli3j-0 bDHxRN">Artist A</a>
    </div>
    """
    tracks = parse_spotify_playlist_html(html)
    assert len(tracks) == 1
    assert tracks[0]["title"] == "Song A"
    assert tracks[0]["artist"] == "Artist A"
    assert tracks[0]["search_query"] == "Artist A - Song A"
