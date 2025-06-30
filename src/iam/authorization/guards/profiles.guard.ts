import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Profile } from '../../../users/enums/profile.enum';
import { REQUEST_USER_KEY } from '../../iam.constants';
import { ActiveUserData } from '../../interfaces/active-user-data.interface';
import { PROFILES_KEY } from '../decorators/profiles.decorator';

@Injectable()
export class ProfilesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const contextProfiles = this.reflector.getAllAndOverride<Profile[]>(
      PROFILES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!contextProfiles) {
      return true;
    }
    const user: ActiveUserData = context.switchToHttp().getRequest()[
      REQUEST_USER_KEY
    ];
    return contextProfiles.some((profile) => user.profile === profile);
  }
}
