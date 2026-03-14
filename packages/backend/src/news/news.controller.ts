import { Controller, Get } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsResponseDto, NewsSourceDto } from './dto/news.dto';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  async getNews(): Promise<NewsResponseDto> {
    return this.newsService.getHeadlines();
  }

  @Get('sources')
  getSources(): NewsSourceDto[] {
    return this.newsService.getSources();
  }
}
