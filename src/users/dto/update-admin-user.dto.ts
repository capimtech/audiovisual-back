import { IsEnum, IsString } from 'class-validator';
import { Profile } from '../enums/profile.enum';

export class UpdateAdminUserDto {
  @IsString()
  name: string;

  @IsEnum(Profile)
  profile: Profile;

  @IsString()
  status: string;
}
