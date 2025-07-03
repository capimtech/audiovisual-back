import {
  BadRequestException,
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
import { Profile } from '../../users/enums/profile.enum';
import { SignUpRequesterDto } from './dto/sign-up-requester.dto';
import { CreateUserDto } from '../../users/dto/create-user.dto';
@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly sendmailService: SendmailService,
    private readonly companyService: CompaniesService,
  ) {}

  async signUpRequester(signUpRequesterDto: SignUpRequesterDto) {
    if (signUpRequesterDto.email !== signUpRequesterDto.confirmEmail) {
      throw new BadRequestException('Emails do not match');
    }

    try {
      const user = new User();
      user.name = signUpRequesterDto.name.trim();
      user.email = signUpRequesterDto.email.toLowerCase().trim();
      user.cpf =
        signUpRequesterDto.cpfCnpj.length === 11
          ? signUpRequesterDto.cpfCnpj
          : undefined;
      user.cnpj =
        signUpRequesterDto.cpfCnpj.length === 14
          ? signUpRequesterDto.cpfCnpj
          : undefined;
      user.adress = signUpRequesterDto.adress;
      user.district = signUpRequesterDto.district;
      user.cep = signUpRequesterDto.cep
        ? parseInt(signUpRequesterDto.cep.replace(/[^0-9]/g, ''))
        : undefined;
      user.city = signUpRequesterDto.city;
      user.state = signUpRequesterDto.state;
      user.phone = signUpRequesterDto.phone;
      user.areaOfActivity = signUpRequesterDto.areaOfActivity;
      user.profile = Profile.REQUISITANTE;

      const companyId = signUpRequesterDto.companyId;
      const company = await this.companyService.findOne(companyId);
      if (!company) throw new BadRequestException('Company not found');
      user.company = company;
      user.companyId = companyId;

      const tempPassword = randomUUID().replace('-', '').slice(0, 10);
      user.password = await this.hashingService.hash(tempPassword);
      user.temporaryPassword = true;

      await this.usersRepository.save(user);

      const mail = {
        to: user.email,
        subject: 'Audio Visual - Cadastro realizado com sucesso!',
        from: process.env.SENDMAIL_EMAIL,
        text: `Audio Visual - Cadastro realizado com sucesso! Acesse sua conta com os seguintes dados. Email: ${user.email} - Senha temporária: ${tempPassword}`,
        html:
          EMAIL_HEADER +
          `
          <p>Olá <strong>${user.name}</strong>,</p>
          <p>Seu cadastro no sistema Audio Visual foi realizado com sucesso. Use a senha temporária abaixo para acessar:</p>
          <p>E-mail: ${user.email}</p>
          <p>Senha temporária: ${tempPassword}</p>
          <p>Por favor, altere sua senha após o primeiro login.</p>
          <p>Link de login: <a href="${process.env.BASE_URL}"></a></p>
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
            <tbody>
              <tr>
                <td align="left">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tbody>
                      <tr>
                        <td> <a href="${process.env.BASE_URL}" target="_blank">Acessar minha conta</a> </td>
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
    } catch (err) {
      const pgUniqueViolationErrorCode = '23505';
      if (err.code === pgUniqueViolationErrorCode) {
        throw new BadRequestException('Email, CPF, or CNPJ already exists');
      }
      throw err;
    }
  }

  async signUpAdmin(createUserDto: CreateUserDto) {
    try {
      const user = new User();
      user.name = createUserDto.name.trim();
      user.email = createUserDto.email.toLowerCase().trim();
      user.cpf =
        createUserDto.cpf.length === 11 ? createUserDto.cpf : undefined;
      user.profile = Profile.ADMIN;

      const tempPassword = randomUUID().replace('-', '').slice(0, 10);
      user.password = await this.hashingService.hash(tempPassword);
      user.temporaryPassword = true;

      const companyId = createUserDto.companyId;
      const company = await this.companyService.findOne(companyId);
      if (!company) throw new BadRequestException('Company not found');
      user.company = company;
      user.companyId = companyId;

      await this.usersRepository.save(user);

      const mail = {
        to: user.email,
        subject: 'Audio Visual - Cadastro realizado com sucesso!',
        from: process.env.SENDMAIL_EMAIL,
        text: `Audio Visual - Cadastro realizado com sucesso! Acesse sua conta com os seguintes dados. Email: ${user.email} - Senha temporária: ${tempPassword}`,
        html:
          EMAIL_HEADER +
          `
          <p>Olá <strong>${user.name}</strong>,</p>
          <p>Seu cadastro no sistema Audio Visual foi realizado com sucesso. Use a senha temporária abaixo para acessar:</p>
          <p>E-mail: ${user.email}</p>
          <p>Senha temporária: ${tempPassword}</p>
          <p>Por favor, altere sua senha após o primeiro login.</p>
          <p>Link de login: <a href="${process.env.BASE_URL}"></a></p>
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
            <tbody>
              <tr>
                <td align="left">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tbody>
                      <tr>
                        <td> <a href="${process.env.BASE_URL}" target="_blank">Acessar minha conta</a> </td>
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
    } catch (err) {
      const pgUniqueViolationErrorCode = '23505';
      if (err.code === pgUniqueViolationErrorCode) {
        throw new BadRequestException('Email, CPF already exists');
      }
      throw err;
    }
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.usersRepository.findOne({
      where: { email: signInDto.email.toLowerCase().trim() },
      select: [
        'id',
        'email',
        'profile',
        'password',
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
      throw new UnauthorizedException('Invalid password');
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
          profile: user.profile,
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
      subject: 'Audio Visual - Recuperação de senha!',
      from: process.env.SENDMAIL_EMAIL,
      text: `Audio Visual - Para recuperar a sua senha utilize o seguinte código. Código: ${code}`,
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
      subject: 'Audio Visual - Senha alterada com sucesso',
      from: process.env.SENDMAIL_EMAIL,
      text: `Audio Visual - Senha alterada com sucesso.`,
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
                        }.audio-visual.app.br" target="_blank">Acessar plataforma</a> </td>
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
