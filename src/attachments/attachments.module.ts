import { Module } from '@nestjs/common';
import { AttachmentsService } from './attachments.service';
import { AttachmentsController } from './attachments.controller';
import { Attachment } from './entities/attachment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3ClientProvider } from './entities/s3Client.provider';
import { S3PresignerProvider } from './entities/s3Presigner.provider';
import { ObjectStorageAdapter } from './entities/objectStorage.adapter';
import { AttachmentRepository } from './entities/attachment.repository';
import { TenantService } from 'src/tenant/tenant.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from 'src/iam/config/jwt.config';
import { CompanyModule } from 'src/companies/companies.module';
import { STSClientProvider } from './entities/stsClient.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attachment]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    CompanyModule,
  ],
  controllers: [AttachmentsController],
  providers: [
    AttachmentsService,
    S3ClientProvider,
    STSClientProvider,
    S3PresignerProvider,
    ObjectStorageAdapter,
    AttachmentRepository,
    TenantService,
  ],
  exports: [AttachmentRepository, AttachmentsService],
})
export class AttachmentsModule {}
