import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CrawlerService } from '../crawler/crawler.service';
import { DownloaderService } from '../downloader/downloader.service';
import { TaggerService } from '../tagger/tagger.service';
import { ProfilesService } from '../../../profiles/profiles.service';
import { ConstructorService } from '../../../constructor/constructor.service';
import * as path from 'path';

@Injectable()
export class OrchestratorService {
  private readonly logger = new Logger(OrchestratorService.name);

  constructor(
    private crawlerService: CrawlerService,
    private downloaderService: DownloaderService,
    private taggerService: TaggerService,
    private profilesService: ProfilesService,
    private constructorService: ConstructorService,
  ) {}

  @Cron(CronExpression.EVERY_12_HOURS)
  async handleSync() {
    this.logger.log('Iniciando ciclo de sincronização agendado...');
    
    // 1. Busca todos os perfis ativos com auto_update ligado
    const profiles = await this.profilesService.findAll();
    const activeProfiles = profiles.filter(p => p.auto_update && p.source_url);

    for (const profile of activeProfiles) {
      try {
        this.logger.log(`Processando perfil: ${profile.name}`);
        
        // 2. Crawling
        let items = [];
        if (profile.source_type === 'SuaMusica') {
          items = await this.crawlerService.crawlSuaMusica(profile.source_url);
        } else if (profile.source_type === 'PalcoMP3') {
          items = await this.crawlerService.crawlPalcoMP3(profile.source_url);
        }

        // 3. Processamento de itens (Ex: baixar os 3 CDs/músicas mais recentes)
        const recentItems = items.slice(0, 3);
        
        for (const item of recentItems) {
          const targetDir = path.join(process.cwd(), '..', 'data', 'processed', profile.name);
          
          // 4. Download
          const downloadedFile = await this.downloaderService.downloadAudio(item.url, targetDir);
          
          if (downloadedFile) {
            // 5. Tagueamento opcional (reforço)
            await this.taggerService.setTags(downloadedFile, {
              title: item.title,
              artist: item.artist || profile.name,
              album: profile.name,
            });
          }
        }
      } catch (error) {
        this.logger.error(`Erro ao processar perfil ${profile.name}: ${error.message}`);
      }
    }

    // 6. Após atualizar os arquivos, gera um novo Snapshot Mestre
    this.logger.log('Gerando novo Snapshot Mestre após sincronização...');
    await this.constructorService.generateMasterSnapshot();
    
    this.logger.log('Ciclo de sincronização finalizado.');
  }

  async runSyncManual(sourceUrl: string, targetDir: string) {
    this.logger.log(`Iniciando sincronização manual para: ${sourceUrl}`);
    const downloadedFile = await this.downloaderService.downloadAudio(sourceUrl, targetDir);
    return downloadedFile;
  }
}
