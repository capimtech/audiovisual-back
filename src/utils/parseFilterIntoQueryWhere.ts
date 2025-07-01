import { Filter } from 'src/common/dto/pageOptions.dto';
import {
  And,
  FindOptionsWhere,
  ILike,
  In,
  IsNull,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Not,
  Raw,
} from 'typeorm';

export function parseFilterIntoQueryWhere<EntityType>(
  filter: Filter<EntityType>,
): FindOptionsWhere<EntityType> {
  const where: FindOptionsWhere<EntityType> = {};

  function handleParseFilter(key: string, operator: any) {
    const operatorKey = Object.keys(operator)[0];

    switch (operatorKey) {
      case 'eq':
        applyCondition(key, operator[operatorKey], (relationKey, value) => ({
          [relationKey]: value === 'null' ? null : value,
        }));
        break;
      case 'search':
        applyCondition(key, operator[operatorKey], (relationKey, value) =>
          value === '' ? {} : { [relationKey]: ILike(`%${value}%`) },
        );
        break;
      case 'nen':
        applyCondition(key, operator[operatorKey], (relationKey, value) =>
          value === 'null'
            ? { [relationKey]: Not(IsNull()) }
            : {
                [relationKey]: Raw(
                  (alias) => `${alias} IS NULL OR ${alias} != :value`,
                  { value },
                ),
              },
        );
        break;
      case 'ne':
        applyCondition(key, operator[operatorKey], (relationKey, value) => ({
          [relationKey]: Not(value),
        }));
        break;
      case 'gt':
        applyCondition(key, operator[operatorKey], (relationKey, value) => ({
          [relationKey]: MoreThan(value),
        }));
        break;
      case 'lt':
        applyCondition(key, operator[operatorKey], (relationKey, value) => ({
          [relationKey]: LessThan(value),
        }));
        break;
      case 'gte':
        applyCondition(key, operator[operatorKey], (relationKey, value) => ({
          [relationKey]: MoreThanOrEqual(value),
        }));
        break;
      case 'lte':
        applyCondition(key, operator[operatorKey], (relationKey, value) => ({
          [relationKey]: LessThanOrEqual(value),
        }));
        break;
      case 'in':
        let parsedFilter = operator[operatorKey];
        try {
          parsedFilter = JSON.parse(parsedFilter);
        } catch (e) {}

        applyCondition(key, parsedFilter, (relationKey, value) => {
          if (Array?.isArray(value) && value?.includes('null')) {
            return {
              [relationKey]: In(
                value.map((item) => (item === 'null' ? null : item)),
              ),
            };
          }
          return { [relationKey]: In(value) };
        });
        break;
      case 'nin':
        let notInFilter = operator[operatorKey];
        try {
          notInFilter = JSON.parse(notInFilter);
        } catch (e) {}

        applyCondition(key, notInFilter, (relationKey, value) => {
          if (Array?.isArray(value) && value?.includes('null')) {
            return {
              [relationKey]: Not(
                In(value.map((item) => (item === 'null' ? null : item))),
              ),
            };
          }
          return { [relationKey]: Not(In(value)) };
        });
        break;
      case 'lk':
        // applyCondition(key, operator[operatorKey], (relationKey, value) => ({
        //   [relationKey]: /[\u00C0-\u00FF]/.test(value)
        //     ? Raw(
        //         (alias) =>
        //           `CAST(TRANSLATE(${alias}, 'áàâäãéèêëẽíìîïĩóòôöõúùûüũç', 'aaaaaeeeeeiiiiiiooooouuuuuc') AS CHAR) ILIKE TRANSLATE('%${value}%', 'áàâäãéèêëẽíìîïĩóòôöõúùûüũç', 'aaaaaeeeeeiiiiiiooooouuuuuc')`,
        //       )
        //     : value === ''
        //       ? {}
        //       : { [relationKey]: ILike(`%${value}%`) },
        // }));
        applyCondition(key, operator[operatorKey], (relationKey, value) =>
          value === '' ? {} : { [relationKey]: ILike(`%${value}%`) },
        );
        break;
      case 'nlk':
        applyCondition(key, operator[operatorKey], (relationKey, value) =>
          value === '' ? {} : { [relationKey]: Not(ILike(`%${value}%`)) },
        );
        break;
    }
  }

  function applyCondition(
    key: string,
    value: any,
    conditionFn: (relationKey: string, value: any) => any,
  ) {
    if (where[key]) {
      where[key] = And(where[key], conditionFn(key, value)[key]);
    } else if (key.includes('.')) {
      const [relation, relationKey, subRelationKey] = key.split('.');

      if (subRelationKey) {
        if (!where[relation][relationKey]) {
          where[relation][relationKey] = {};
        }

        Object.assign(
          where[relation][relationKey],
          conditionFn(subRelationKey, value),
        );
      } else {
        if (!where[relation]) {
          where[relation] = {};
        }

        Object.assign(where[relation], conditionFn(relationKey, value));
      }
    } else {
      Object.assign(where, conditionFn(key, value));
    }
  }

  Object.keys(filter).forEach((key) => {
    const filterCondition = filter[key];
    if (
      !filter?.[key]?.['in'] &&
      !filter?.[key]?.['nin'] &&
      Array.isArray(filterCondition)
    ) {
      filterCondition.forEach((condition) => handleParseFilter(key, condition));
    } else {
      handleParseFilter(key, filterCondition);
    }
  });

  return where;
}
