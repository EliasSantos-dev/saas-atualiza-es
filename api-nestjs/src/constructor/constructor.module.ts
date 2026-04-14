import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConstructorService } from './constructor.service';
import { ConstructorController, SnapshotsController } from './constructor.controller';
import { Config, ConfigSchema } from './schemas/config.schema';
import { Snapshot, SnapshotSchema } from '../sync/schemas/snapshot.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Config.name, schema: ConfigSchema },
      { name: Snapshot.name, schema: SnapshotSchema },
    ]),
  ],
  providers: [ConstructorService],
  controllers: [ConstructorController, SnapshotsController],
  exports: [ConstructorService],
})
export class ConstructorModule {}
