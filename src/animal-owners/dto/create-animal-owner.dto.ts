import { IsUUID, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreateAnimalOwnerDto {
  @IsUUID()
  ownerId: string;

  @IsNumber()
  percentage: number;

  @IsOptional()
  @IsBoolean()
  isResponsible?: boolean;
}
