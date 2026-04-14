import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { ConstructorService } from './constructor.service';

@Controller('config')
export class ConstructorController {
  constructor(private constructorService: ConstructorService) {}

  @Get(':profileId')
  async getConfig(@Param('profileId') profileId: string) {
    return this.constructorService.getConfig(profileId);
  }

  @Put(':profileId')
  async updateConfig(@Param('profileId') profileId: string, @Body() body: any) {
    return this.constructorService.updateConfig(profileId, body);
  }
}

@Controller('snapshots')
export class SnapshotsController {
  constructor(private constructorService: ConstructorService) {}

  @Post('generate-master')
  async generateMaster() {
    return this.constructorService.generateMasterSnapshot();
  }
}
