import {
  IsEmail,
  IsString,
  /* MinLength, */
  Matches,
  Validate,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { IsValidCpfCnpjConstraint } from 'src/common/dto/cpf-cnpj.validation';
import { AreaOfActivity } from '../../../users/enums/area-of-activity.enum';
import { MatchEmailConstraint } from '../../../common/dto/email-confirm.validation';

export class SignUpRequesterDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsEmail()
  @IsNotEmpty({ message: 'Confirm email is required' })
  @Validate(MatchEmailConstraint, { message: 'Emails do not match' })
  confirmEmail: string;

  /* @MinLength(8)
  @IsNotEmpty({ message: 'Password is required' })
  password: string; */

  @IsString()
  @Matches(/^\d{11}$|^\d{14}$/, {
    message: 'CPF or CNPJ must contain exactly 11 or 14 digits',
  })
  @Validate(IsValidCpfCnpjConstraint, {
    message: 'CPF or CNPJ is not valid',
  })
  @IsNotEmpty({ message: 'CPF or CNPJ is required' })
  cpfCnpj: string;

  @IsOptional()
  @IsString()
  adress?: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsString()
  cep?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsEnum(AreaOfActivity)
  @IsNotEmpty({ message: 'Area of activity is required' })
  areaOfActivity: AreaOfActivity;

  @IsUUID()
  @IsNotEmpty({ message: 'Company ID is required' })
  companyId: string;
}
