import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../decorators/auth.decorator';
import { GoogleTokenDto } from '../dto/google-token.dto';
import { AuthType } from '../enums/auth-type.enum';
import { GoogleAuthenticationService } from './google-authentication.service';

@ApiTags('authentication/google')
@Auth(AuthType.NONE)
@Controller('authentication/google')
export class GoogleAuthenticationController {
  constructor(
    private readonly googleAuthService: GoogleAuthenticationService,
  ) {}

  @Post()
  authenticate(@Body() tokenDto: GoogleTokenDto) {
    return this.googleAuthService.authenticate(tokenDto.token);
  }
}
