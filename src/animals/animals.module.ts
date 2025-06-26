import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnimalsController } from './animals.controller';
import { AnimalsService } from './animals.service';
import { AnimalRepository } from './entities/animal.repository';
import { Animal } from './entities/animal.entity';
import { CompanyModule } from 'src/companies/companies.module';
import { TenantService } from 'src/tenant/tenant.service';
import { AttachmentsModule } from 'src/attachments/attachments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Animal]),
    CompanyModule,
    AttachmentsModule,
  ],
  controllers: [AnimalsController],
  providers: [AnimalsService, AnimalRepository, TenantService],
  exports: [AnimalsService, AnimalRepository],
})
export class AnimalsModule {}
