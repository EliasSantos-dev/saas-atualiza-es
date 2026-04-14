import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConstructorModule } from './constructor/constructor.module';
import { SyncModule } from './sync/sync.module';
import { EngineModule } from './engine/engine.module';
import { DatabaseModule } from './database/database.module';
import { ProfilesModule } from './profiles/profiles.module';
import { MediaController } from './media/media.controller';
import { MediaService } from './media/media.service';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UsersModule,
    ConstructorModule,
    SyncModule,
    EngineModule,
    ProfilesModule,
  ],
  controllers: [AppController, MediaController],
  providers: [AppService, MediaService],
})
export class AppModule {}
