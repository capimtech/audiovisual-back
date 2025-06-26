import { Transform } from 'class-transformer';
import { IsEmail, MinLength } from 'class-validator';

export class SignInDto {
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @MinLength(8)
  password: string;
}
