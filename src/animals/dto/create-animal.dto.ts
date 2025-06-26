import { ApiProperty } from '@nestjs/swagger';
import { AnimalOwner } from 'src/animal-owners/entities/animal-owner.entity';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
} from 'class-validator';
import { AnimalAttachment } from '../entities/animal-attachment.entity';

export class CreateAnimalDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  nickname: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  genre: string;

  @ApiProperty()
  @IsOptional()
  birthDate: Date;

  @ApiProperty()
  @IsOptional()
  @IsString()
  earpiece: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  function: string;

  @ApiProperty()
  @IsOptional()
  registerDate: Date;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isRegistered: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  registerNumber: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isChipped: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  chipNumber: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  rationControl: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  species: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  race: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  category: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  coat: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  availableForSale: boolean;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  condition: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  father: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  mother: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  paternalGrandmother: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  paternalGrandfather: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  maternalGrandmother: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  maternalGrandfather: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  marketValue: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  saleValue: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  minimumSaleValue: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  repTird: boolean;

  @ApiProperty()
  @IsOptional()
  registerType: string;

  @ApiProperty()
  @IsOptional()
  invoiceClose: string;

  @ApiProperty()
  @IsOptional()
  generation: string;

  @ApiProperty()
  @IsOptional()
  location: string;

  @ApiProperty()
  @IsOptional()
  status: string;

  @ApiProperty()
  @IsOptional()
  companyId: string;

  @ApiProperty()
  @IsOptional()
  farmId: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  animalOwners: Partial<AnimalOwner>[];

  @IsOptional()
  @IsArray()
  attachments: Partial<AnimalAttachment>[];
}
