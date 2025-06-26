import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { Role } from '../../users/enums/role.enum';

export class PaginationQueryDto {
  @IsString()
  @IsOptional()
  order?: 'ASC' | 'DESC';

  @Type(() => Number)
  @IsOptional()
  @IsPositive()
  limit?: number;

  @Type(() => Number)
  @IsOptional()
  @Min(0)
  offset?: number;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsBoolean()
  @IsOptional()
  showInactive?: boolean;

  @IsString()
  @IsOptional()
  artists?: string;

  @IsNumber()
  @IsOptional()
  month?: number;

  @IsNumber()
  @IsOptional()
  year?: number;

  @IsString()
  @IsOptional()
  search?: string;
}
