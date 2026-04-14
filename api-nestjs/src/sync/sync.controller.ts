import { Controller, Post, Body, Get, Param, NotFoundException } from '@nestjs/common';
import { SyncService } from './sync.service';

@Controller('sync')
export class SyncController {
  constructor(private syncService: SyncService) {}

  @Post('delta')
  async getDelta(@Body() clientManifest: any) {
    const profileId = clientManifest.profile_id;
    if (!profileId) throw new NotFoundException('Profile ID não fornecido');

    const latestSnapshot = await this.syncService.getLatestSnapshot(profileId);
    if (!latestSnapshot) throw new NotFoundException('Snapshot não encontrado');

    const delta = this.syncService.calculateDelta(
      clientManifest.files || [],
      latestSnapshot.files || []
    );

    return {
      latest_version: latestSnapshot.version,
      delta: delta,
      folder_links: latestSnapshot.folder_links || {}
    };
  }
}

@Controller('snapshots')
export class SnapshotsGetController {
  constructor(private syncService: SyncService) {}

  @Get(':profileId/latest')
  async getLatest(@Param('profileId') profileId: string) {
    const snapshot = await this.syncService.getLatestSnapshot(profileId);
    if (!snapshot) throw new NotFoundException('Nenhum snapshot encontrado');
    return snapshot;
  }
}
