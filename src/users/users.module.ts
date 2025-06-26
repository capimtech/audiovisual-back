import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from '../companies/entities/company.entity';
import { AccessTokenGuard } from '../iam/authentication/guards/access-token.guard';
import { AuthenticationGuard } from '../iam/authentication/guards/authentication.guard';
import { RolesGuard } from '../iam/authorization/guards/roles.guard';
import jwtConfig from '../iam/config/jwt.config';
import { BcryptService } from '../iam/hashing/bcrypt.service';
import { HashingService } from '../iam/hashing/hashing.service';
import { SendmailService } from '../sendmail/sendmail.service';
import { TenantService } from '../tenant/tenant.service';
import { UploadService } from '../upload/upload.service';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserRepository } from './entities/user.repository';
import { CompanyModule } from 'src/companies/companies.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company, User]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    CompanyModule,
  ],
  controllers: [UsersController],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    AccessTokenGuard,
    SendmailService,
    UsersService,
    UploadService,
    TenantService,
    UserRepository,
  ],
  exports: [UsersService],
})
export class UsersModule {}
