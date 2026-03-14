import {
  IsString,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateMessageDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsEnum(['info', 'warning', 'urgent', 'event'])
  type: 'info' | 'warning' | 'urgent' | 'event';

  @IsNumber()
  priority: number;

  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}

export class UpdateMessageDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsEnum(['info', 'warning', 'urgent', 'event'])
  @IsOptional()
  type?: 'info' | 'warning' | 'urgent' | 'event';

  @IsNumber()
  @IsOptional()
  priority?: number;

  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;
}
