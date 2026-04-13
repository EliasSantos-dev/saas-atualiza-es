import os
import argparse
import json
from src.engine.orchestrator import sync_from_spotify, sync_from_suamusica
from src.engine.importer import build_manifest

def generate_manifest(directory, profile_id="default_profile", version="1.0.0", output="manifest_oficial.json"):
    if not os.path.exists(directory):
        print(f"Erro: Pasta '{directory}' não encontrada.")
        return None

    print(f"Gerando manifesto para: {directory}...")
    manifest = build_manifest(directory, profile_id, version)
    
    with open(output, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=4, ensure_ascii=False)
    
    print(f"Sucesso! Manifesto gerado em: {output}")
    return manifest

def main():
    parser = argparse.ArgumentParser(description="SaaS Atualiza - Engine de Música")
    subparsers = parser.add_subparsers(dest="command", help="Comandos disponíveis")
    
    # 1. Comando sync-spotify
    sp_parser = subparsers.add_parser("sync-spotify", help="Sincroniza músicas de uma playlist do Spotify")
    sp_parser.add_argument("url", help="URL da playlist do Spotify")
    sp_parser.add_argument("--dir", default="data/processed/HITS", help="Diretório de destino (default: data/processed/HITS)")
    sp_parser.add_argument("--force", action="store_true", help="Força o download de todas as músicas mesmo se já existirem")
    
    # 2. Comando sync-suamusica
    sm_parser = subparsers.add_parser("sync-suamusica", help="Sincroniza CDs de um perfil do Sua Música")
    sm_parser.add_argument("url", help="URL do perfil ou CD no Sua Música")
    sm_parser.add_argument("--dir", default="data/processed/CDs", help="Diretório de destino (default: data/processed/CDs)")

    # 3. Comando manifest
    mf_parser = subparsers.add_parser("manifest", help="Gera um manifesto JSON de uma pasta local")
    mf_parser.add_argument("--dir", required=True, help="Pasta raiz para escanear")
    mf_parser.add_argument("--profile", default="default_profile", help="ID do perfil")
    mf_parser.add_argument("--version", default="1.0.0", help="Versão do manifesto")
    mf_parser.add_argument("--output", default="manifest.json", help="Arquivo de saída (default: manifest.json)")

    args = parser.parse_args()
    
    if args.command == "sync-spotify":
        print(f"--- Iniciando Sincronização: {args.dir} ---")
        success, errors = sync_from_spotify(args.url, args.dir)
        print(f"--- Fim! {success} baixadas, {errors} erros. ---")
        
    elif args.command == "sync-suamusica":
        print(f"Iniciando sincronização de Sua Música para: {args.dir}")
        success, errors = sync_from_suamusica(args.url, args.dir)
        print(f"\nConcluído! Sucesso: {success}, Erros: {errors}")
        
    elif args.command == "manifest":
        generate_manifest(args.dir, args.profile, args.version, args.output)
    
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
