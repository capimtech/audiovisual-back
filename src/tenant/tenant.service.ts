import { Injectable, Scope } from '@nestjs/common';
import { Company } from '../companies/entities/company.entity';

@Injectable({
  scope: Scope.REQUEST,
})
export class TenantService {
  private tenant: Company;

  setTenant(tenant: Company) {
    this.tenant = tenant;
  }

  getTenant() {
    return this.tenant;
  }
}
