import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

type MinusKey<Type> = {
  [Property in keyof Type as `-${string & Property}`]: Type[Property];
};

type FilterOperator<ValueType> =
  | {
      eq: ValueType;
    }
  | {
      ne: ValueType;
    }
  | {
      gt: ValueType;
    }
  | {
      lt: ValueType;
    }
  | {
      gte: ValueType;
    }
  | {
      lte: ValueType;
    }
  | {
      in: string | ValueType[];
    };

export type Filter<Type> = {
  [key in keyof Type]?: FilterOperator<Type[key]>;
};

export class PageOptionsDto<Type = Record<string, unknown>> {
  @ApiPropertyOptional({
    description: 'The number of items per page',
    minimum: 1,
    default: 10,
    maximum: 1000,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(1000)
  @Type(() => Number)
  pageSize: number;

  @ApiPropertyOptional({
    description: 'The page number to retrieve',
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  pageNumber: number;

  @ApiPropertyOptional({
    description: 'The sort order',
    default: 'createdAt',
  })
  @IsOptional()
  @IsString()
  sort: keyof Type | keyof MinusKey<Type>;

  @ApiPropertyOptional({
    description: 'The filter options',
  })
  @IsOptional()
  filter: Filter<Type>;

  @ApiPropertyOptional({
    description: 'Seach query',
  })
  @IsOptional()
  search?: string;
}
