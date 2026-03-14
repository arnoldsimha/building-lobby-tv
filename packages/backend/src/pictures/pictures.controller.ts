import { Controller, Get, Put, Body } from '@nestjs/common';
import { PicturesService } from './pictures.service';
import { PictureConfigDto } from './dto/picture.dto';

@Controller('pictures')
export class PicturesController {
  constructor(private readonly picturesService: PicturesService) {}

  @Get()
  getPictures() {
    return this.picturesService.getPictureConfig();
  }

  @Put()
  updatePictures(@Body() pictureConfigDto: PictureConfigDto) {
    return this.picturesService.updatePictureConfig(pictureConfigDto as any);
  }
}
