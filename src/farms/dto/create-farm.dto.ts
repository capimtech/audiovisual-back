import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  IsEmail,
} from 'class-validator';

export class CreateFarmDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsOptional()
  companyId: string;

  @ApiProperty()
  @IsOptional()
  ownerId: string;

  @IsBoolean()
  @IsNotEmpty()
  isOwned: boolean;

  @IsString()
  @IsOptional()
  adminContactName?: string;

  @IsString()
  @IsOptional()
  adminContactPhone?: string;

  @IsEmail()
  @IsOptional()
  adminContactEmail?: string;

  @IsString()
  @IsOptional()
  financialContactName?: string;

  @IsString()
  @IsOptional()
  financialContactPhone?: string;

  @IsEmail()
  @IsOptional()
  financialContactEmail?: string;

  @IsBoolean()
  @IsOptional()
  status?: boolean;
}
