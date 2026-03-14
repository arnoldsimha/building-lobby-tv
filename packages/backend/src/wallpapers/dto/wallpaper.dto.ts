import {
  IsString,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class WallpaperDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  filename: string;

  @IsString()
  title: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}

export class WallpaperConfigDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WallpaperDto)
  @IsOptional()
  wallpapers?: WallpaperDto[];

  @IsBoolean()
  @IsOptional()
  rotationEnabled?: boolean;

  @IsNumber()
  @IsOptional()
  rotationInterval?: number;
}
