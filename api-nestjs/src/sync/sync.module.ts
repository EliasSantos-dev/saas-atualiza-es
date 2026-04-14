import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SyncService } from './sync.service';
import { SyncController, SnapshotsGetController } from './sync.controller';
import { Snapshot, SnapshotSchema } from './schemas/snapshot.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Snapshot.name, schema: SnapshotSchema }]),
  ],
  providers: [SyncService],
  controllers: [SyncController, SnapshotsGetController],
  exports: [SyncService, MongooseModule],
})
export class SyncModule {}
