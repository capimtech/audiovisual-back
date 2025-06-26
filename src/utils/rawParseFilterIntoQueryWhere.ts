/* eslint-disable @typescript-eslint/no-unused-vars */
import { Filter } from 'src/common/dto/pageOptions.dto';
import { SelectQueryBuilder } from 'typeorm';

export function rawParseFilterIntoQueryWhere<EntityType>(
  filter: Filter<EntityType>,
  queryBuilder: SelectQueryBuilder<EntityType>,
): SelectQueryBuilder<EntityType> {
  function applyFiltersToQueryBuilder<EntityType>(
    queryBuilder: SelectQueryBuilder<EntityType>,
    filter: Record<string, any>,
  ) {
    Object.keys(filter).forEach((key) => {
      const filterCondition = filter[key];
      if (!filter?.[key]?.['in'] && Array.isArray(filterCondition)) {
        filterCondition.forEach((condition) =>
          handleParseFilter(queryBuilder, key, condition),
        );
      } else {
        handleParseFilter(queryBuilder, key, filterCondition);
      }
    });
  }

  function handleParseFilter<EntityType>(
    queryBuilder: SelectQueryBuilder<EntityType>,
    key: string,
    operator: any,
  ) {
    const operatorKey = Object.keys(operator)[0];
    const parameterName = `${key}_${operatorKey}`;

    switch (operatorKey) {
      case 'eq':
        applyCondition(
          queryBuilder,
          key,
          operator[operatorKey],
          (alias, value) =>
            value === 'null'
              ? `${alias} IS NULL`
              : `${alias} = :${parameterName}`,
        );
        queryBuilder.setParameter(parameterName, operator[operatorKey]);
        break;

      case 'search':
        applyCondition(
          queryBuilder,
          key,
          operator[operatorKey],
          (alias, value) =>
            value === '' ? '' : `${alias} ILIKE :${parameterName}`,
        );
        queryBuilder.setParameter(parameterName, `%${operator[operatorKey]}%`);
        break;

      case 'nen':
        applyCondition(
          queryBuilder,
          key,
          operator[operatorKey],
          (alias, value) =>
            value === 'null'
              ? `${alias} IS NOT NULL`
              : `(${alias} IS NULL OR ${alias} != :${parameterName})`,
        );
        queryBuilder.setParameter(parameterName, operator[operatorKey]);
        break;

      case 'ne':
        applyCondition(
          queryBuilder,
          key,
          operator[operatorKey],
          (alias, value) => `${alias} != :${parameterName}`,
        );
        queryBuilder.setParameter(parameterName, operator[operatorKey]);
        break;

      case 'gt':
        applyCondition(
          queryBuilder,
          key,
          operator[operatorKey],
          (alias, value) => `${alias} > :${parameterName}`,
        );
        queryBuilder.setParameter(parameterName, operator[operatorKey]);
        break;

      case 'lt':
        applyCondition(
          queryBuilder,
          key,
          operator[operatorKey],
          (alias, value) => `${alias} < :${parameterName}`,
        );
        queryBuilder.setParameter(parameterName, operator[operatorKey]);
        break;

      case 'gte':
        applyCondition(
          queryBuilder,
          key,
          operator[operatorKey],
          (alias, value) => `${alias} >= :${parameterName}`,
        );
        queryBuilder.setParameter(parameterName, operator[operatorKey]);
        break;

      case 'lte':
        applyCondition(
          queryBuilder,
          key,
          operator[operatorKey],
          (alias, value) => `${alias} <= :${parameterName}`,
        );
        queryBuilder.setParameter(parameterName, operator[operatorKey]);
        break;

      case 'in':
        let parsedFilter = operator[operatorKey];
        try {
          parsedFilter = JSON.parse(parsedFilter);
        } catch (e) {}

        applyCondition(queryBuilder, key, parsedFilter, (alias, value) =>
          Array.isArray(value) && value.includes('null')
            ? `(${alias} IN (:...${parameterName}) OR ${alias} IS NULL)`
            : `${alias} IN (:...${parameterName})`,
        );
        queryBuilder.setParameter(
          parameterName,
          parsedFilter.map((item) => (item === 'null' ? null : item)),
        );
        break;

      case 'lk':
        applyCondition(
          queryBuilder,
          key,
          operator[operatorKey],
          (alias, value) =>
            `CAST(TRANSLATE(${alias}, 'áàâäãéèêëẽíìîïĩóòôöõúùûüũç', 'aaaaaeeeeeiiiiiiooooouuuuuc') AS CHAR) ILIKE TRANSLATE(:${parameterName}, 'áàâäãéèêëẽíìîïĩóòôöõúùûüũç', 'aaaaaeeeeeiiiiiiooooouuuuuc')`,
        );
        queryBuilder.setParameter(parameterName, `%${operator[operatorKey]}%`);
        break;
    }
  }

  function applyCondition<EntityType>(
    queryBuilder: SelectQueryBuilder<EntityType>,
    key: string,
    value: any,
    conditionFn: (alias: string, value: any) => string,
  ) {
    const alias = key.includes('.') ? key : `${queryBuilder.alias}.${key}`;

    if (value !== undefined && value !== null) {
      const condition = conditionFn(alias, value);
      if (condition) {
        queryBuilder.andWhere(condition);
      }
    }
  }

  applyFiltersToQueryBuilder(queryBuilder, filter);

  return queryBuilder;
}
