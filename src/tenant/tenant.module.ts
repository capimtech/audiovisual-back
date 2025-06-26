import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from '../companies/entities/company.entity';
import { User } from '../users/entities/user.entity';
import { TenantInterceptor } from './tenant.interceptor';
import { TenantService } from './tenant.service';
import { CompanyModule } from 'src/companies/companies.module';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Company, User]), CompanyModule],
  providers: [TenantService, TenantInterceptor],
})
export class TenantModule {}
