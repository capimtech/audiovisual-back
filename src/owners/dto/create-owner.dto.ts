import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateOwnerDto {
  @IsString()
  cpfCnpj: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsBoolean()
  @IsOptional()
  status?: boolean;

  @IsString()
  @IsOptional()
  adminContactName?: string;

  @IsString()
  @IsOptional()
  adminContactPhone?: string;

  @IsString()
  @IsOptional()
  adminContactEmail?: string;

  @IsString()
  @IsOptional()
  financialContactName?: string;

  @IsString()
  @IsOptional()
  financialContactPhone?: string;

  @IsString()
  @IsOptional()
  financialContactEmail?: string;
}
