import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuppliesController } from './supplies.controller';
import { SuppliesService } from './supplies.service';
import { SupplyRepository } from './entities/supply.repository';
import { Supply } from './entities/supply.entity';
import { TenantService } from 'src/tenant/tenant.service';

@Module({
  imports: [TypeOrmModule.forFeature([Supply])],
  controllers: [SuppliesController],
  providers: [SuppliesService, SupplyRepository, TenantService],
  exports: [SuppliesService],
})
export class SuppliesModule {}
