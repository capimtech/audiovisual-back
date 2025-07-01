import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TenantService } from './tenant.service';
import { CompaniesService } from '../companies/companies.service';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  constructor(
    private tenantService: TenantService,
    private companiesService: CompaniesService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const company = await this.companiesService.findOne(user.companyId);
    if (!company) throw new BadRequestException('Company not found');

    this.tenantService.setTenant(company);

    return next.handle();
  }
}
