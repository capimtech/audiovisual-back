import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticationService } from './authentication.service';
import { SignUpRequesterDto } from './dto/sign-up-requester.dto';
import { SignInDto } from './dto/sign-in.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { CheckForgotPasswordDto } from './dto/check-forgot-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@ApiTags('authentication')
@Auth(AuthType.NONE)
@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('sign-up-requester')
  signUpRequester(@Body() signUpDto: SignUpRequesterDto) {
    return this.authService.signUpRequester(signUpDto);
  }

  @Post('sign-up-admin')
  signUpAdmin(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUpAdmin(createUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('forgot-password')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('check-forgot-password')
  checkForgotPassword(@Body() checkForgotPasswordDto: CheckForgotPasswordDto) {
    return this.authService.checkForgotPassword(checkForgotPasswordDto);
  }

  @Post('update-password')
  updatePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    return this.authService.updatePassword(updatePasswordDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }
}
