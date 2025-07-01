import { IsString } from 'class-validator';

export class UpdateUserPasswordDto {
  @IsString()
  password: string;
}
