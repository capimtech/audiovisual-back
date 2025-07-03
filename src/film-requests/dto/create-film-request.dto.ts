import {
  IsNotEmpty,
  IsArray,
  IsString,
  IsEnum,
  IsNumber,
  IsBoolean,
  ValidateIf,
} from 'class-validator';
import { FilmRequestAttachment } from '../entities/film-request-attachment.entity';
import { ProductionType } from '../enums/production-type.enum';
import { Status } from '../enums/status.enum';

export class CreateFilmRequestDto {
  @IsString()
  @IsNotEmpty()
  productionName: string;

  @IsString()
  @IsNotEmpty()
  productionCompany: string;

  @IsString()
  @IsNotEmpty()
  legalRepresentative: string;

  @IsEnum(ProductionType)
  @IsNotEmpty()
  productionType: ProductionType;

  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;

  @IsNumber()
  @IsNotEmpty()
  crewSize: number;

  @IsString()
  @IsNotEmpty()
  filmingSchedule: string;

  @IsString()
  @IsNotEmpty()
  requestedLocations: string;

  @IsString()
  @IsNotEmpty()
  synopsis: string;

  @IsString()
  @IsNotEmpty()
  filmingPlan: string;

  @IsString()
  @IsNotEmpty()
  equipmentList: string;

  @IsString()
  @IsNotEmpty()
  estimatedImpacts: string;

  @IsBoolean()
  @IsNotEmpty()
  municipalSupportRequired: boolean;

  @ValidateIf((o) => o.municipalSupportRequired === true)
  @IsString()
  @IsNotEmpty()
  municipalSupportDetails?: string;

  @IsArray()
  @IsNotEmpty()
  attachments: Partial<FilmRequestAttachment>[];
}
