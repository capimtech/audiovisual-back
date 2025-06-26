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
import { TenantService } from '../tenant/tenant.service';
import { UploadService } from '../upload/upload.service';
import { EMAIL_BOTTOM, EMAIL_HEADER } from '../utils';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './entities/user.repository';
import { Role } from './enums/role.enum';

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
    // private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
    private readonly sendmailService: SendmailService,
    private readonly tenantService: TenantService,
  ) {}

  async create(
    activeUser: ActiveUserData,
    createUserDto: CreateUserDto,
    file: Express.Multer.File,
  ) {
    if (activeUser.role !== Role.ADMIN) {
      throw new BadRequestException('Você pode cadastrar apenas contratantes.');
    }

    try {
      const user = new User();

      user.name = createUserDto.name.trim();
      user.email = createUserDto.email.toLowerCase().trim();
      user.role = createUserDto.role;
      user.companyId = createUserDto.companyId;

      const randomPassword = randomUUID();
      const tempPassword = randomPassword.replace('-', '').slice(0, 10);

      user.password = await this.hashingService.hash(tempPassword);
      user.temporaryPassword = true;

      const response = await this.userRepository.create(user);

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
            <p>Link de login: <a href="${process.env.BASE_URL}"
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

      if (file) {
        try {
          const uploadedData = await this.uploadService.uploadToS3(
            file,
            `/users/${user.id}`,
          );

          user.image = uploadedData.url;
          await this.userRepository.update(user.id, {
            image: uploadedData.url,
          });
        } catch (error) {
          console.error(error);
        }
      }

      return response;
    } catch (err) {
      const pgUniqueViolationErrorCode = '23505';
      if (err.code === pgUniqueViolationErrorCode) {
        throw new BadRequestException(
          'Já existe um usuário cadastrado com este e-mail!',
        );
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
          role: true,
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
    if (activeUser.role !== Role.ADMIN) {
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
    if (activeUser.role !== Role.ADMIN) {
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
