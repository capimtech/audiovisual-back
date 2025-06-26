import { Filter } from './pageOptions.dto';

export interface PageOptionsCaseInput<Type> {
  pageSize?: number;
  pageNumber?: number;
  sort?: {
    [Property in keyof Type]?: 'ASC' | 'DESC';
  };
  filter?: Filter<Type>;
  search?: string;
}
