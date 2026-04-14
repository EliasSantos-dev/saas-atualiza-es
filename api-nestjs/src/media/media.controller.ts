import { Controller, Get, Query, StreamableFile, Header } from '@nestjs/common';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get('download')
  @Header('Content-Type', 'audio/mpeg')
  download(@Query('path') filePath: string): StreamableFile {
    return this.mediaService.getFileStream(filePath);
  }
}
