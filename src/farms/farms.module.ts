import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FarmsController } from './farms.controller';
import { FarmsService } from './farms.service';
import { FarmRepository } from './entities/farm.repository';
import { Farm } from './entities/farm.entity';
import { TenantService } from 'src/tenant/tenant.service';
import { CompanyModule } from 'src/companies/companies.module';
import { AnimalsModule } from 'src/animals/animals.module';

@Module({
  imports: [TypeOrmModule.forFeature([Farm]), CompanyModule, AnimalsModule],
  controllers: [FarmsController],
  providers: [FarmsService, FarmRepository, TenantService],
  exports: [FarmsService],
})
export class FarmsModule {}
