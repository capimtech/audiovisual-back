import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSupplyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  status: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  measureUnit: string;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  stockQuantity: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  minimumQuantity: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  unitPrice: number;
}
