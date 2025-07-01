import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class UsersPaginationQueryDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  field?: 'name' | 'email' | 'role' | 'status';
}
