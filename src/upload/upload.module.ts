import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import jwtConfig from '../iam/config/jwt.config';
import { BcryptService } from '../iam/hashing/bcrypt.service';
import { HashingService } from '../iam/hashing/hashing.service';
import { SendmailService } from '../sendmail/sendmail.service';
import { TenantService } from '../tenant/tenant.service';
import { User } from '../users/entities/user.entity';
import { UploadService } from './upload.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule.forFeature(jwtConfig),
  ],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    SendmailService,
    TenantService,
    UploadService,
  ],
  exports: [UploadService],
})
export class UploadModule {}
