import { Controller, Get, Put, Param, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { WallpapersService } from './wallpapers.service';
import { WallpaperConfigDto } from './dto/wallpaper.dto';

@Controller('wallpapers')
export class WallpapersController {
  constructor(private readonly wallpapersService: WallpapersService) {}

  @Get()
  getWallpapers() {
    return this.wallpapersService.getWallpaperConfig();
  }

  @Put()
  updateWallpapers(@Body() wallpaperConfigDto: WallpaperConfigDto) {
    return this.wallpapersService.updateWallpaperConfig(wallpaperConfigDto as any);
  }

  @Get('images/:filename')
  getImage(@Param('filename') filename: string, @Res() res: Response) {
    return this.wallpapersService.serveImage(filename, res);
  }

  /** Proxy Unsplash API call (hides access key). Returns photo URLs for direct use. */
  @Get('unsplash')
  getUnsplashPhotos() {
    return this.wallpapersService.getUnsplashPhotos();
  }
}
