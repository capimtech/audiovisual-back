import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AttachmentsModule } from './attachments/attachments.module';
import { CompanyModule } from './companies/companies.module';
import appConfig from './config/app.config';
import dbConfig from './config/db.config';
import { envSchema } from './env';
import { IamModule } from './iam/iam.module';
import { SendmailController } from './sendmail/sendmail.controller';
import { SendmailService } from './sendmail/sendmail.service';
import { TenantModule } from './tenant/tenant.module';
import { UploadModule } from './upload/upload.module';
import { UploadService } from './upload/upload.service';
import { UsersModule } from './users/users.module';
import { OwnersModule } from './owners/owners.module';
import { FarmsModule } from './farms/farms.module';
import { AnimalsModule } from './animals/animals.module';
import { AnimalOwnersModule } from './animal-owners/animal-owners.module';
import { AnimalServicesModule } from './animal-service/animal-services.module';
import { SuppliesModule } from './supplies/supplies.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      // ignoreEnvFile: process.env.NODE_ENV === 'production',
      load: [appConfig, dbConfig],
      // validationSchema: Joi.object({
      //   DATABASE_HOST: Joi.required(),
      //   DATABASE_PORT: Joi.number().default(5432),
      // }),
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get('database'),
        migrationsRun: process?.env?.NODE_ENV?.toLowerCase() === 'production',
        // logging: true,
      }),
    }),
    FarmsModule,
    OwnersModule,
    ScheduleModule.forRoot(),
    IamModule,
    UploadModule,
    UsersModule,
    CompanyModule,
    TenantModule,
    AttachmentsModule,
    AnimalsModule,
    AnimalOwnersModule,
    AnimalServicesModule,
    SuppliesModule,
  ],
  controllers: [AppController, SendmailController],
  providers: [AppService, UploadService, SendmailService],
})
export class AppModule {}
