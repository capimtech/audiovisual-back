import { IsBoolean, IsEmail, IsOptional } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsBoolean()
  setTemporaryPassword?: boolean;
}
