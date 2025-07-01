import { ApiProperty } from '@nestjs/swagger';
import { PageMetaResponse } from './pageMeta.response';

export class PaginatedEntityResponse<DataType> {
  @ApiProperty({
    isArray: true,
  })
  data: DataType[];

  @ApiProperty({ type: () => PageMetaResponse })
  meta: PageMetaResponse;

  constructor(data: DataType[], count: number, pagesize: number) {
    this.data = data;
    this.meta = new PageMetaResponse(Math.ceil(count / pagesize), count);
  }
}
