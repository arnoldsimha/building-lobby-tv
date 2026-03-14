import { Module } from '@nestjs/common';
import { MusicController } from './music.controller';
import { MusicService } from './music.service';
import { MUSIC_REPOSITORY } from '../common/interfaces/music-repository.interface';
import { JsonMusicRepository } from '../common/repositories/json-music.repository';

@Module({
  controllers: [MusicController],
  providers: [
    MusicService,
    {
      provide: MUSIC_REPOSITORY,
      useClass: JsonMusicRepository,
    },
  ],
  exports: [MusicService],
})
export class MusicModule {}
