export class ShabbatTimesDto {
  candleLighting: string;
  havdalah: string;
  parasha: string;
  parashaEnglish: string;
  date: string;
}

export class ShabbatResponseDto {
  data: ShabbatTimesDto;
  cached: boolean;
  fetchedAt: string;
}

export class ShabbatUpcomingResponseDto {
  data: ShabbatTimesDto[];
  cached: boolean;
  fetchedAt: string;
}
