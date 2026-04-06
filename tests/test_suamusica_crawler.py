from src.engine.suamusica_crawler import parse_suamusica_profile

def test_parse_suamusica_profile():
    html = """
    <div class="box-music">
        <a href="/kelcds/cd-paredao-2026" class="title">CD Paredão 2026</a>
    </div>
    """
    cds = parse_suamusica_profile(html)
    assert len(cds) == 1
    assert cds[0]["title"] == "CD Paredão 2026"
    assert cds[0]["url"] == "https://suamusica.com.br/kelcds/cd-paredao-2026"
