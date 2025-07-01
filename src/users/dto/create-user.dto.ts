import {
  IsEnum,
  IsString,
  Matches,
  IsNotEmpty,
  Validate,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { Profile } from '../enums/profile.enum';
import { AreaOfActivity } from '../enums/area-of-activity.enum';
import { IsValidCpfCnpjConstraint } from '../../common/dto/cpf-cnpj.validation';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @Matches(/^\d{11}$/, { message: 'CPF must contain exactly 11 digits' })
  @Validate(IsValidCpfCnpjConstraint, { message: 'CPF is not valid' })
  @IsOptional()
  cpf?: string;

  @IsString()
  @Matches(/^\d{11}$|^\d{14}$/, {
    message: 'CPF or CNPJ must contain exactly 11 or 14 digits',
  })
  @Validate(IsValidCpfCnpjConstraint, { message: 'CPF or CNPJ is not valid' })
  @IsOptional()
  cpfCnpj?: string;

  @IsOptional()
  @IsString()
  adress?: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{5}-?\d{3}$/, { message: 'CEP must be in format 12345-678' })
  cep?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[A-Z]{2}$/, {
    message: 'State must be a 2-letter code (e.g., SP)',
  })
  state?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?\d{10,15}$/, { message: 'Phone must be a valid number' })
  phone?: string;

  @IsOptional()
  @IsEnum(AreaOfActivity)
  areaOfActivity?: AreaOfActivity;

  @IsEnum(Profile)
  @IsNotEmpty({ message: 'Profile is required' })
  profile: Profile;

  @IsOptional()
  @IsString()
  password?: string;

  @IsUUID()
  @IsNotEmpty({ message: 'Company ID is required' })
  companyId: string;
}
