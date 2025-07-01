import { ApiProperty } from '@nestjs/swagger';

export class PageMetaResponse {
  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  totalCount: number;

  constructor(totalPages: number, totalCount: number) {
    this.totalPages = totalPages;
    this.totalCount = totalCount;
  }
}
