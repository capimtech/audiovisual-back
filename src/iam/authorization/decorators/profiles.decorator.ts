import { SetMetadata } from '@nestjs/common';
import { Profile } from '../../../users/enums/profile.enum';

export const PROFILES_KEY = 'profiles';
export const Profiles = (...profiles: Profile[]) =>
  SetMetadata(PROFILES_KEY, profiles);
