import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { addDays, isBefore } from 'date-fns';
import { Repository } from 'typeorm';
import { CompaniesService } from '../../companies/companies.service';
import { SendmailService } from '../../sendmail/sendmail.service';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { User } from '../../users/entities/user.entity';
import { EMAIL_BOTTOM, EMAIL_HEADER } from '../../utils';
import jwtConfig from '../config/jwt.config';
import { HashingService } from '../hashing/hashing.service';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { CheckForgotPasswordDto } from './dto/check-forgot-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SignInDto } from './dto/sign-in.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
// import { RefreshTokenIdsStorage } from './refresh-token-ids.storage';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>, // private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
    private readonly sendmailService: SendmailService,
    private readonly companyService: CompaniesService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    let user: User;
    let tempPassword: string;

    try {
      const companyId = createUserDto.companyId;

      const company = await this.companyService.findOne(companyId);
      if (!company) throw new BadRequestException('Company not found');

      user = new User();

      user.name = createUserDto.name.trim();
      user.email = createUserDto.email.toLowerCase().trim();
      user.role = createUserDto.role;
      if (createUserDto.password) {
        const userPassword = createUserDto.password;
        user.password = await this.hashingService.hash(userPassword);
        user.temporaryPassword = false;
        tempPassword = createUserDto.password;
      } else {
        const randomPassword = randomUUID();
        tempPassword = randomPassword.replace('-', '').slice(0, 10);
        user.password = await this.hashingService.hash(tempPassword);
        user.temporaryPassword = true;
      }
      user.company = company;
      user.companyId = companyId;

      await this.usersRepository.save(user);
    } catch (err) {
      console.error('ERR', err);
      const pgUniqueViolationErrorCode = '23505';
      if (err.code === pgUniqueViolationErrorCode) {
        throw new ConflictException();
      }
      throw err;
    }

    const mail = {
      to: createUserDto.email,
      subject: 'APL Ranch - Conta criada com sucesso!',
      from: process.env.SENDMAIL_EMAIL,
      text: `APL Ranch - Cadastro realizado com sucesso! Acesse sua conta com os seguintes dados. Email: ${user.email} - Senha: ${tempPassword}`,
      html:
        EMAIL_HEADER +
        `
          <p>Olá <strong>${user.name}</strong>,</p>
          <p>Agora você tem acesso ao sistema APL Ranch. Para acessar basta inserir os dados abaixo:</p>
          <p>E-mail: ${user.email}</p>
          <p>Senha: ${tempPassword}</p>
          <p>Link de login: <a href="${process.env.BASE_URL}"></a></p>
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
            <tbody>
              <tr>
                <td align="left">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tbody>
                      <tr>
                        <td> <a href="${
                          process.env.BASE_URL
                        }" target="_blank">Acessar minha conta</a> </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        ` +
        EMAIL_BOTTOM,
    };
    await this.sendmailService.send(mail);
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.usersRepository.findOne({
      where: {
        email: signInDto.email,
      },
      select: [
        'id',
        'email',
        'role',
        'password',
        'image',
        'temporaryPassword',
        'companyId',
      ],
    });
    if (!user) {
      throw new UnauthorizedException('User does not exists');
    }
    const isEqual = await this.hashingService.compare(
      signInDto.password,
      user.password,
    );

    if (!isEqual) {
      throw new UnauthorizedException('User does not exists');
    }
    const userData = await this.generateTokens(user);
    return userData;
  }

  async generateTokens(user: User) {
    const refreshTokenId = randomUUID();
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<ActiveUserData>>(
        user.id,
        this.jwtConfiguration.accessTokenTtl,
        {
          email: user.email,
          role: user.role,
          image: user.image,
          temporaryPassword: user.temporaryPassword,
          companyId: user.companyId,
        },
      ),
      this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl, {
        refreshTokenId,
      }),
    ]);

    // await this.refreshTokenIdsStorage.insert(user.id, refreshTokenId);

    delete user.password;
    delete user.googleId;

    return {
      ...user,
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      try {
        const { sub } = await this.jwtService.verifyAsync<
          Pick<ActiveUserData, 'sub'> & { refreshTokenId: string }
        >(refreshTokenDto.refreshToken, {
          secret: this.jwtConfiguration.secret,
          audience: this.jwtConfiguration.audience,
          issuer: this.jwtConfiguration.issuer,
        });
        const user = await this.usersRepository.findOneByOrFail({
          id: sub,
        });
        return this.generateTokens(user);
      } catch (error) {
        console.error(error);
      }

      // const isValid = await this.refreshTokenIdsStorage.validate(
      //   user.id,
      //   refreshTokenId,
      // );
      // if (isValid) {
      //   await this.refreshTokenIdsStorage.invalidate(user.id);
      // } else {
      //   throw new Error('Refresh token is invalid');
      // }
    } catch (err) {
      throw new UnauthorizedException();
    }
  }

  async forgotPassword(forgotPassword: ForgotPasswordDto) {
    const user = await this.usersRepository.findOne({
      where: {
        email: forgotPassword.email,
      },
    });
    if (!user) {
      return;
    }

    const randomPassword = randomUUID();
    const code = randomPassword.replace('-', '').slice(0, 6);

    user.code = code;
    user.expirationCode = addDays(new Date(), 1);
    if (forgotPassword.setTemporaryPassword) user.temporaryPassword = true;

    await this.usersRepository.save(user);

    const mail = {
      to: forgotPassword.email,
      subject: 'APL Ranch - Recuperação de senha!',
      from: process.env.SENDMAIL_EMAIL,
      text: `APL Ranch - Para recuperar a sua senha utilize o seguinte código. Código: ${code}`,
      html:
        EMAIL_HEADER +
        `
          <p>Olá <strong>${user.name}</strong>,</p>
          <p>Você, ou alguém utilizando o seu email, solicitou a recuperação da sua senha.</p>
          <p><strong>Caso não tenha sido você, desconsirede esse email.</strong></p>
          <p>Link de recuperação:</p>
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
            <tbody>
              <tr>
                <td align="left">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tbody>
                      <tr>
                        <td>
                          <a href="${
                            process.env.BASE_URL
                          }/nova-senha?code=${code}&email=${encodeURI(
                            user.email,
                          )}" target="_blank">Recuperar minha conta
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <p>Ou acesse pelo link:</p>
          <p>${
            process.env.BASE_URL
          }/nova-senha?code=${code}&email=${encodeURI(user.email)}</p>
        ` +
        EMAIL_BOTTOM,
    };
    await this.sendmailService.send(mail);
  }

  async checkForgotPassword(checkForgotPassword: CheckForgotPasswordDto) {
    const user = await this.usersRepository.findOne({
      where: {
        email: checkForgotPassword.email,
        code: checkForgotPassword.code,
      },
    });
    if (!user) {
      return false;
    }
    if (isBefore(new Date(), user.expirationCode)) {
      return true;
    } else {
      return false;
    }
  }

  async updatePassword(updatePassword: UpdatePasswordDto) {
    const user = await this.usersRepository.findOne({
      where: {
        email: updatePassword.email,
        code: updatePassword.code,
      },
    });
    if (!user) {
      return;
    }

    user.code = null;
    user.expirationCode = null;
    user.temporaryPassword = false;

    user.password = await this.hashingService.hash(updatePassword.password);

    await this.usersRepository.save(user);

    const mail = {
      to: updatePassword.email,
      subject: 'APL Ranch - Senha alterada com sucesso',
      from: process.env.SENDMAIL_EMAIL,
      text: `APL Ranch - Senha alterada com sucesso.`,
      html:
        EMAIL_HEADER +
        `
          <p>Olá <strong>${user.name}</strong>,</p>
          <p>A sua senha foi alterada com sucesso. Agora você já tem acesso novamente à nossa plataforma.</p>
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
            <tbody>
              <tr>
                <td align="left">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tbody>
                      <tr>
                        <td> <a href="https://${
                          process.env.NODE_ENV !== 'production' ? 'test' : 'app'
                        }.apl-ranch.app.br" target="_blank">Acessar plataforma</a> </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        ` +
        EMAIL_BOTTOM,
    };
    await this.sendmailService.send(mail);
  }

  private async signToken<T>(userId: string, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }
}
