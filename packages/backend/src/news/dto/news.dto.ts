export class NewsItemDto {
  title: string;
  link: string;
  pubDate: string;
  source: string;
}

export class NewsResponseDto {
  items: NewsItemDto[];
  source: string;
  fetchedAt: string;
}

export class NewsSourceDto {
  key: string;
  name: string;
  url: string;
  category: string;
}
