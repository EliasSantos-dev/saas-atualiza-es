import json
import os
from src.engine.importer import build_manifest

def main():
    root_dir = "16gb_atualizacao_abril_2026_@kelcds"
    profile_id = "perfil_oficial_abril"
    version = "v1.0"
    output_file = "manifest.json"

    if not os.path.exists(root_dir):
        print(f"Erro: Pasta '{root_dir}' não encontrada na raiz.")
        return

    print(f"Gerando manifesto para: {root_dir}...")
    manifest = build_manifest(root_dir, profile_id, version)
    
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=4, ensure_ascii=False)
    
    print(f"Sucesso! Manifesto gerado em: {output_file}")
    print(f"Total de músicas: {len(manifest['files'])}")

if __name__ == "__main__":
    main()
