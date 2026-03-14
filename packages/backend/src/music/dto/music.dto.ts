import {
  IsString,
  IsBoolean,
  IsNumber,
  IsEnum,
  IsOptional,
  IsArray,
  ValidateNested,
  IsUrl,
  Allow,
} from 'class-validator';
import { Type } from 'class-transformer';

class LocalTrackDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  filename: string;

  @IsString()
  title: string;

  @IsString()
  artist: string;
}

class RadioStationDto {
  @IsString()
  name: string;

  @IsUrl()
  url: string;
}

export class MusicConfigDto {
  @IsBoolean()
  enabled: boolean;

  @IsNumber()
  volume: number;

  @IsEnum(['local', 'radio', 'custom'])
  source: 'local' | 'radio' | 'custom';

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LocalTrackDto)
  localPlaylist: LocalTrackDto[];

  @ValidateNested()
  @Type(() => RadioStationDto)
  radioStation: RadioStationDto;

  @Allow()
  customStreamUrl: string | null;

  @IsNumber()
  currentIndex: number;

  @IsBoolean()
  shuffle: boolean;

  @IsBoolean()
  autoplay: boolean;
}

export class UpdateMusicConfigDto {
  @IsBoolean()
  @IsOptional()
  enabled?: boolean;

  @IsNumber()
  @IsOptional()
  volume?: number;

  @IsEnum(['local', 'radio', 'custom'])
  @IsOptional()
  source?: 'local' | 'radio' | 'custom';

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LocalTrackDto)
  @IsOptional()
  localPlaylist?: LocalTrackDto[];

  @ValidateNested()
  @Type(() => RadioStationDto)
  @IsOptional()
  radioStation?: RadioStationDto;

  @Allow()
  @IsOptional()
  customStreamUrl?: string | null;

  @IsNumber()
  @IsOptional()
  currentIndex?: number;

  @IsBoolean()
  @IsOptional()
  shuffle?: boolean;

  @IsBoolean()
  @IsOptional()
  autoplay?: boolean;
}
