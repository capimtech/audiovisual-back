import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { Role } from '../enums/role.enum';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsEnum(Role)
  role: Role;

  @IsOptional()
  @IsString()
  password?: string;

  @IsUUID()
  companyId: string;
}
