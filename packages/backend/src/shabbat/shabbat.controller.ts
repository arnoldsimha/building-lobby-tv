import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { ShabbatService } from './shabbat.service';
import {
  ShabbatTimesDto,
  ShabbatResponseDto,
  ShabbatUpcomingResponseDto,
} from './dto/shabbat.dto';

@Controller('shabbat')
export class ShabbatController {
  constructor(private readonly shabbatService: ShabbatService) {}

  @Get()
  async getShabbatTimes(): Promise<ShabbatResponseDto> {
    const result = await this.shabbatService.getShabbatTimes();
    if (!result) {
      throw new HttpException(
        'Unable to fetch Shabbat times',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
    return {
      data: result,
      cached: false,
      fetchedAt: new Date().toISOString(),
    };
  }

  @Get('upcoming')
  async getUpcoming(): Promise<ShabbatUpcomingResponseDto> {
    const results = await this.shabbatService.getUpcoming();
    return {
      data: results,
      cached: false,
      fetchedAt: new Date().toISOString(),
    };
  }
}
