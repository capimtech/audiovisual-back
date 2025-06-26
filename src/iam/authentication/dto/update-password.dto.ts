import { IsEmail, IsString } from 'class-validator';

export class UpdatePasswordDto {
  @IsEmail()
  email: string;

  @IsString()
  code: string;

  @IsString()
  password: string;
}
