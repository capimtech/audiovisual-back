import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PageOptionsCaseInput } from 'src/common/dto/pageOptions.caseInput';
import { PaginatedEntityResponse } from 'src/common/presentation/paginatedEntity.response';
import { ActiveUser } from '../iam/decorators/active-user.decorator';
import { HashingService } from '../iam/hashing/hashing.service';
import { ActiveUserData } from '../iam/interfaces/active-user-data.interface';
import { SendmailService } from '../sendmail/sendmail.service';
import { UploadService } from '../upload/upload.service';
import { EMAIL_BOTTOM, EMAIL_HEADER } from '../utils';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './entities/user.repository';
import { Profile } from './enums/profile.enum';
import { CompaniesService } from '../companies/companies.service';

export type ListUsersCaseSortInput = Pick<
  User,
  'id' | 'createdAt' | 'companyId'
>;

@Injectable()
export class UsersService {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly uploadService: UploadService,
    private readonly hashingService: HashingService,
    private readonly sendmailService: SendmailService,
    private readonly companyService: CompaniesService,
  ) {}

  async createAdmin(
    activeUser: ActiveUserData,
    createUserDto: CreateUserDto,
    file?: Express.Multer.File,
  ) {
    if (activeUser.profile !== Profile.ADMIN) {
      throw new UnauthorizedException('Only admins can create users');
    }

    if (createUserDto.profile !== Profile.ADMIN) {
      throw new BadRequestException(
        'Use createRequester to create non-admin users',
      );
    }

    if (!createUserDto.cpf || createUserDto.cpf.length !== 11) {
      throw new BadRequestException('Admins must have a valid CPF (11 digits)');
    }

    if (createUserDto.cpfCnpj) {
      throw new BadRequestException('Admins cannot have CPF/CNPJ field');
    }

    try {
      const company = await this.companyService.findOne(
        createUserDto.companyId,
      );
      if (!company) throw new BadRequestException('Company not found');

      const user = new User();
      user.name = createUserDto.name.trim();
      user.email = createUserDto.email.toLowerCase().trim();
      user.cpf = createUserDto.cpf;
      user.profile = Profile.ADMIN;
      user.company = company;
      user.companyId = createUserDto.companyId;

      const password =
        createUserDto.password || randomUUID().replace('-', '').slice(0, 10);
      user.password = await this.hashingService.hash(password);
      user.temporaryPassword = !createUserDto.password;

      await this.userRepository.save(user);

      const mail = {
        to: user.email,
        subject: 'Audio Visual - Conta criada com sucesso!',
        from: process.env.SENDMAIL_EMAIL,
        text: `Audio Visual - Cadastro realizado com sucesso! Acesse sua conta com os seguintes dados. Email: ${user.email} - Senha ${!createUserDto.password ? 'temporária' : ''}: ${password}`,
        html:
          EMAIL_HEADER +
          `
          <p>Olá <strong>${user.name}</strong>,</p>
          <p>Seu cadastro no sistema Audio Visual foi realizado com sucesso. Use ${!createUserDto.password ? 'a senha temporária' : 'sua senha'} abaixo para acessar:</p>
          <p>E-mail: ${user.email}</p>
          <p>Senha ${!createUserDto.password ? 'temporária' : ''}: ${password}</p>
          ${!createUserDto.password ? '<p>Por favor, altere sua senha após o primeiro login.</p>' : ''}
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

      if (file) {
        const uploadedData = await this.uploadService.uploadToS3(
          file,
          `/users/${user.id}`,
        );
        user.image = uploadedData.url;
        await this.userRepository.save(user);
      }

      return user;
    } catch (err) {
      const pgUniqueViolationErrorCode = '23505';
      if (err.code === pgUniqueViolationErrorCode) {
        throw new BadRequestException('Email or CPF already exists');
      }
      throw err;
    }
  }

  async createRequester(
    activeUser: ActiveUserData,
    createUserDto: CreateUserDto,
    file?: Express.Multer.File,
  ) {
    if (activeUser.profile !== Profile.ADMIN) {
      throw new UnauthorizedException('Only admins can create users');
    }

    if (createUserDto.profile !== Profile.REQUISITANTE) {
      throw new BadRequestException('Use createAdmin to create admin users');
    }

    if (
      !createUserDto.cpfCnpj ||
      ![11, 14].includes(createUserDto.cpfCnpj.length)
    ) {
      throw new BadRequestException(
        'Requesters must have a valid CPF (11 digits) or CNPJ (14 digits)',
      );
    }

    if (createUserDto.cpf) {
      throw new BadRequestException(
        'Requesters cannot have CPF field; use cpfCnpj',
      );
    }

    try {
      const company = await this.companyService.findOne(
        createUserDto.companyId,
      );
      if (!company) throw new BadRequestException('Company not found');

      const user = new User();
      user.name = createUserDto.name.trim();
      user.email = createUserDto.email.toLowerCase().trim();
      user.cpf =
        createUserDto.cpfCnpj.length === 11 ? createUserDto.cpfCnpj : undefined;
      user.cnpj =
        createUserDto.cpfCnpj.length === 14 ? createUserDto.cpfCnpj : undefined;
      user.adress = createUserDto.adress;
      user.district = createUserDto.district;
      user.cep = createUserDto.cep
        ? parseInt(createUserDto.cep.replace(/[^0-9]/g, ''))
        : undefined;
      user.city = createUserDto.city;
      user.state = createUserDto.state;
      user.phone = createUserDto.phone;
      user.areaOfActivity = createUserDto.areaOfActivity;
      user.profile = Profile.REQUISITANTE;
      user.company = company;
      user.companyId = createUserDto.companyId;

      const password =
        createUserDto.password || randomUUID().replace('-', '').slice(0, 10);
      user.password = await this.hashingService.hash(password);
      user.temporaryPassword = !createUserDto.password;

      await this.userRepository.save(user);

      const mail = {
        to: user.email,
        subject: 'Audio Visual - Conta criada com sucesso!',
        from: process.env.SENDMAIL_EMAIL,
        text: `Audio Visual - Cadastro realizado com sucesso! Acesse sua conta com os seguintes dados. Email: ${user.email} - Senha ${!createUserDto.password ? 'temporária' : ''}: ${password}`,
        html:
          EMAIL_HEADER +
          `
          <p>Olá <strong>${user.name}</strong>,</p>
          <p>Seu cadastro no sistema Audio Visual foi realizado com sucesso. Use ${!createUserDto.password ? 'a senha temporária' : 'sua senha'} abaixo para acessar:</p>
          <p>E-mail: ${user.email}</p>
          <p>Senha ${!createUserDto.password ? 'temporária' : ''}: ${password}</p>
          ${!createUserDto.password ? '<p>Por favor, altere sua senha após o primeiro login.</p>' : ''}
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
      console.log('Sending email to:', mail.to);
      await this.sendmailService.send(mail);

      if (file) {
        const uploadedData = await this.uploadService.uploadToS3(
          file,
          `/users/${user.id}`,
        );
        user.image = uploadedData.url;
        await this.userRepository.save(user);
      }

      return user;
    } catch (err) {
      const pgUniqueViolationErrorCode = '23505';
      if (err.code === pgUniqueViolationErrorCode) {
        throw new BadRequestException('Email, CPF, or CNPJ already exists');
      }
      throw err;
    }
  }

  async findAll({
    filter,
    pageNumber = 1,
    pageSize = 10,
    sort = { createdAt: 'DESC' },
  }: PageOptionsCaseInput<ListUsersCaseSortInput>): Promise<
    PaginatedEntityResponse<User>
  > {
    const [data, count] = await this.userRepository.findMany({
      filter,
      skip: (pageNumber - 1) * pageSize,
      sort,
      take: pageSize,
    });

    return new PaginatedEntityResponse(data, count, pageSize);
  }

  async findOne(@ActiveUser() activeUser: ActiveUserData, id: string) {
    if (activeUser.sub !== id) {
      throw new UnauthorizedException();
    }

    try {
      const user = await this.userRepository.rawFindOne({
        where: {
          id,
        },
        select: {
          id: true,
          name: true,
          email: true,
          profile: true,
          status: true,
          image: true,
        },
      });

      if (!user) throw new BadRequestException('User not found');

      return user;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async update(
    @ActiveUser() activeUser: ActiveUserData,
    id: string,
    updateUserDto: UpdateUserDto,
    file: Express.Multer.File,
  ) {
    if (activeUser.sub !== id) {
      throw new UnauthorizedException();
    }

    try {
      const user = await this.userRepository.rawFindOne({
        where: {
          id,
        },
      });

      if (!user) throw new BadRequestException('User not found');

      if (file) {
        try {
          const uploadedData = await this.uploadService.uploadToS3(
            file,
            `/users/${user.id}`,
          );

          user.image = uploadedData.url;
        } catch (error) {
          console.error(error);
        }
      }

      return await this.userRepository.save({ ...user, ...updateUserDto });
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async updatePassword(
    @ActiveUser() activeUser: ActiveUserData,
    updateUserPasswordDto: UpdateUserPasswordDto,
  ) {
    try {
      const user = await this.userRepository.rawFindOne({
        where: {
          email: activeUser.email,
        },
      });
      user.password = await this.hashingService.hash(
        updateUserPasswordDto.password,
      );
      user.temporaryPassword = false;

      return await this.userRepository.save(user);
    } catch (error) {
      throw new Error('Error trying to update user password');
    }
  }

  async activate(id: string, activeUser: ActiveUserData): Promise<User> {
    if (activeUser.profile !== Profile.ADMIN) {
      throw new UnauthorizedException('Only admins can activate users.');
    }

    if (activeUser.sub === id) {
      throw new BadRequestException('You cannot activate yourself.');
    }

    const user = await this.userRepository.rawFindOne({
      where: { id },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.status) {
      throw new BadRequestException('User is already active');
    }

    user.status = true;
    return await this.userRepository.save(user);
  }

  async deactivate(id: string, activeUser: ActiveUserData): Promise<User> {
    if (activeUser.profile !== Profile.ADMIN) {
      throw new UnauthorizedException('Only admins can deactivate users.');
    }

    if (activeUser.sub === id) {
      throw new BadRequestException('You cannot deactivate yourself.');
    }

    const user = await this.userRepository.rawFindOne({
      where: { id },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (!user.status) {
      throw new BadRequestException('User is already inactive');
    }

    user.status = false;
    return await this.userRepository.save(user);
  }

  async remove(id: string) {
    try {
      const user = await this.userRepository.rawFindOne({
        where: {
          id,
        },
      });

      if (!user) throw new BadRequestException('User not found');

      user.deletedAt = new Date();
      await this.userRepository.save(user);
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
