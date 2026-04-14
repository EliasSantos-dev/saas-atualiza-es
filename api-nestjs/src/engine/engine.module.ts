import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CrawlerService } from './services/crawler/crawler.service';
import { DownloaderService } from './services/downloader/downloader.service';
import { TaggerService } from './services/tagger/tagger.service';
import { OrchestratorService } from './services/orchestrator/orchestrator.service';
import { ProfilesModule } from '../profiles/profiles.module';
import { ConstructorModule } from '../constructor/constructor.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ProfilesModule,
    ConstructorModule,
  ],
  providers: [
    CrawlerService,
    DownloaderService,
    TaggerService,
    OrchestratorService,
  ],
  exports: [
    CrawlerService,
    DownloaderService,
    TaggerService,
    OrchestratorService,
  ],
})
export class EngineModule {}
