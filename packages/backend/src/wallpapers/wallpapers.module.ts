import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WallpapersController } from './wallpapers.controller';
import { WallpapersService } from './wallpapers.service';
import { WALLPAPER_REPOSITORY } from '../common/interfaces/wallpaper-repository.interface';
import { JsonWallpaperRepository } from '../common/repositories/json-wallpaper.repository';

@Module({
  imports: [HttpModule],
  controllers: [WallpapersController],
  providers: [
    WallpapersService,
    {
      provide: WALLPAPER_REPOSITORY,
      useClass: JsonWallpaperRepository,
    },
  ],
  exports: [WallpapersService],
})
export class WallpapersModule {}
