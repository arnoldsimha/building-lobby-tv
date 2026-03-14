import { Controller, Get, Put, Param, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { MusicService } from './music.service';
import { UpdateMusicConfigDto } from './dto/music.dto';

@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @Get()
  getConfig() {
    return this.musicService.getConfig();
  }

  @Put()
  updateConfig(@Body() updateMusicConfigDto: UpdateMusicConfigDto) {
    return this.musicService.updateConfig(updateMusicConfigDto as any);
  }

  @Get('stream/:filename')
  streamFile(@Param('filename') filename: string, @Res() res: Response) {
    return this.musicService.streamFile(filename, res);
  }
}
