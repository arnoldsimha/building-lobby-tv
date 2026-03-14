import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class LocationDto {
  @IsNumber()
  @IsOptional()
  geonameid?: number;

  @IsString()
  @IsOptional()
  city?: string;
}

class NewsDto {
  @IsString()
  @IsOptional()
  activeSource?: string;

  @IsNumber()
  @IsOptional()
  refreshInterval?: number;
}

class DisplayDto {
  @IsNumber()
  @IsOptional()
  messageRotationInterval?: number;

  @IsNumber()
  @IsOptional()
  wallpaperRotationInterval?: number;

  @IsNumber()
  @IsOptional()
  shabbatCacheInterval?: number;
}

class ThemeDto {
  @IsString()
  @IsOptional()
  primaryColor?: string;

  @IsString()
  @IsOptional()
  accentColor?: string;

  @IsString()
  @IsOptional()
  panelBackground?: string;

  @IsString()
  @IsOptional()
  textColor?: string;
}

export class UpdateSettingsDto {
  @IsString()
  @IsOptional()
  buildingName?: string;

  @IsString()
  @IsOptional()
  buildingAddress?: string;

  @IsEnum(['he', 'en'])
  @IsOptional()
  language?: 'he' | 'en';

  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  @IsOptional()
  location?: LocationDto;

  @IsObject()
  @ValidateNested()
  @Type(() => NewsDto)
  @IsOptional()
  news?: NewsDto;

  @IsObject()
  @ValidateNested()
  @Type(() => DisplayDto)
  @IsOptional()
  display?: DisplayDto;

  @IsObject()
  @ValidateNested()
  @Type(() => ThemeDto)
  @IsOptional()
  theme?: ThemeDto;
}
