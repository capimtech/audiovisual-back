import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsDateString,
  IsNumber,
  IsOptional,
  IsArray,
} from 'class-validator';
import { AnimalServiceAttachment } from '../entities/animal-service-attachment.entity';

export class CreateAnimalServiceDto {
  @IsUUID()
  animalId: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  date: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  value: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  attachments: Partial<AnimalServiceAttachment>[];
}
