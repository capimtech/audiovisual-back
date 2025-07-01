import {
  ConflictException,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { OAuth2Client } from 'google-auth-library';
import { Repository } from 'typeorm';
import { User } from '../../../users/entities/user.entity';
import { AuthenticationService } from '../authentication.service';

@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {
  private oauthClient: OAuth2Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthenticationService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  onModuleInit() {
    const clientId = this.configService.get('GOOGLE_CLIENT_ID');
    const clientSecret = this.configService.get('GOOGLE_CLIENT_SECRET');
    this.oauthClient = new OAuth2Client(clientId, clientSecret);
  }

  async authenticate(token: string) {
    try {
      // Get payload information using the token provided
      const loginTicket = await this.oauthClient.verifyIdToken({
        idToken: token,
      });

      // Get email and googleId
      const { email, sub: googleId } = loginTicket.getPayload();

      // Checks if the user exists by googleId
      const user = await this.userRepository.findOneBy({ googleId });

      if (user) {
        return this.authService.generateTokens(user);
      } else {
        // Checks if the user exists by email
        const userByEmail = await this.userRepository.findOneBy({ email });
        if (userByEmail) {
          userByEmail.googleId = googleId;
          await this.userRepository.update(userByEmail.id, userByEmail);

          delete userByEmail.password;
          delete userByEmail.googleId;

          return this.authService.generateTokens(userByEmail);
        } else {
          const newUser = await this.userRepository.save({ email, googleId });
          return this.authService.generateTokens(newUser);
        }
      }
    } catch (err) {
      const pgUniqueViolationErrorCode = '23505';
      if (err.code === pgUniqueViolationErrorCode) {
        throw new ConflictException();
      }
      throw new UnauthorizedException();
    }
  }
}
