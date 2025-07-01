import { IsEmail, IsString } from 'class-validator';

export class CheckForgotPasswordDto {
  @IsEmail()
  email: string;

  @IsString()
  code: string;
}
