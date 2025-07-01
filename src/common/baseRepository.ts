import { parseFilterIntoQueryWhere } from 'src/utils/parseFilterIntoQueryWhere';
import {
  Brackets,
  DeepPartial,
  FindManyOptions,
  FindOptionsOrder,
  FindOptionsRelationByString,
  FindOptionsRelations,
  FindOptionsWhere,
  ILike,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Filter } from './dto/pageOptions.dto';
export type SortInputProps = {
  id: string;
  createdAt: Date;
};

export interface FindManyParams<T> {
  skip?: number;
  relations?: FindOptionsRelations<T> | FindOptionsRelationByString;
  sort?: {
    [key in keyof SortInputProps]?: 'ASC' | 'DESC';
  };
  take?: number;
  filter?: Filter<T>;
  search?: string;
  searchFields?: (keyof T)[];
}

export abstract class BaseRepositoryAdapter<T> {
  protected constructor(private readonly repository: Repository<T>) {}

  async rawFindOne(options: FindOneOptions<T>): Promise<T | null> {
    return this.repository.findOne(options);
  }

  async rawFindOneQueryBuilder(
    options: FindOneOptions<T>,
  ): Promise<SelectQueryBuilder<T>> {
    const queryBuilder = this.repository
      .createQueryBuilder('entity')
      .where(options.where);

    if (options?.relations && Array.isArray(options?.relations)) {
      const addedJoins = new Set<string>();

      options.relations.forEach((relation) => {
        const relationPath = relation.split('.');
        let alias = 'entity';

        relationPath.forEach((path, index) => {
          const currentPath = `${alias}.${path}`;
          const currentAlias = relationPath.slice(0, index + 1).join('_');

          if (!addedJoins.has(currentPath)) {
            queryBuilder.leftJoinAndSelect(currentPath, currentAlias);
            addedJoins.add(currentPath);
          }

          alias = currentAlias;
        });
      });
    }

    return queryBuilder;
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const createdModel = this.repository.create(data);
    return await this.repository.save(createdModel);
  }

  async findById({ id }: { id: string }): Promise<T | null> {
    return this.repository.findOne({
      where: { id } as unknown as FindOptionsWhere<T>,
    });
  }

  async update(id: string, data: QueryDeepPartialEntity<T>): Promise<T> {
    await this.repository.update(id, data);
    return await this.findById({ id });
  }

  async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findMany({
    skip = 0,
    sort = { createdAt: 'DESC' },
    take,
    filter,
    relations = undefined,
    search,
    searchFields,
  }: FindManyParams<T>): Promise<[T[], number]> {
    const query: FindManyOptions<T> = {
      skip: skip,
      take: take
        ? take
        : this?.repository?.metadata?.name?.includes('AccountingEntry')
          ? undefined
          : 10,
      order: sort as FindOptionsOrder<T>,
      relations,
    };

    if (search) {
      query.where = searchFields?.map((field) => ({
        [field]: ILike(`%${search}%`),
      })) as FindOptionsWhere<T>[];
    }

    if (filter) {
      query.where = parseFilterIntoQueryWhere(filter);

      if (search) {
        query.where = [
          ...searchFields?.map((field) => ({
            [field]: ILike(`%${search}%`),
            ...parseFilterIntoQueryWhere(filter),
          })),
        ];
      }
    }

    return await this.repository.findAndCount(query);
  }

  async rawCreateQueryBuilder({
    skip = 0,
    sort = { createdAt: 'DESC' },
    take,
    filter,
    relations = undefined,
    search,
    searchFields,
    // select,
  }: FindManyParams<T> & FindManyOptions<T>): Promise<SelectQueryBuilder<T>> {
    const queryBuilder = this.repository.createQueryBuilder('entity');

    if (relations && Array.isArray(relations)) {
      const addedJoins = new Set<string>();

      relations.forEach((relation) => {
        const relationPath = relation.split('.');
        let alias = 'entity';

        relationPath.forEach((path, index) => {
          const currentPath = `${alias}.${path}`;
          const currentAlias = relationPath.slice(0, index + 1).join('_');

          if (!addedJoins.has(currentPath)) {
            queryBuilder.leftJoinAndSelect(currentPath, currentAlias);
            addedJoins.add(currentPath);
          }

          alias = currentAlias;
        });
      });
    }

    // if (select && Array.isArray(select)) {
    //   select.forEach((field) => {
    //     queryBuilder.addSelect(`entity.${field as string}`);
    //   });
    // }

    Object.entries(sort).forEach(([key, order]) => {
      queryBuilder.addOrderBy(`entity.${key}`, order as 'ASC' | 'DESC');
    });

    if (filter) {
      const whereFilter = parseFilterIntoQueryWhere(filter);
      queryBuilder.andWhere(whereFilter);
    }

    if (search && searchFields) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          searchFields.forEach((field) => {
            qb.orWhere(`entity.${field as string} ILIKE :search`, {
              search: `%${search}%`,
            });
          });
        }),
      );
    }
    if (skip) {
      queryBuilder.skip(skip);
    }

    const takeParsed = take
      ? take
      : this?.repository?.metadata?.name?.includes('AccountingEntry')
        ? undefined
        : 10;
    if (takeParsed) {
      queryBuilder.take(takeParsed);
    }

    return queryBuilder;
  }

  async count({
    filter,
    search,
    searchFields,
  }: FindManyParams<T>): Promise<number> {
    const query: FindManyOptions<T> = {};

    if (search) {
      query.where = searchFields?.map((field) => ({
        [field]: ILike(`%${search}%`),
      })) as FindOptionsWhere<T>[];
    }

    if (filter) {
      query.where = parseFilterIntoQueryWhere(filter);

      if (search) {
        query.where = [
          ...searchFields?.map((field) => ({
            [field]: ILike(`%${search}%`),
            ...parseFilterIntoQueryWhere(filter),
          })),
        ];
      }
    }

    return await this.repository.count(query);
  }

  async save(data: T): Promise<T> {
    return await this.repository.save(data);
  }

  async softDelete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }
}
