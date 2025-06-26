// export function parseSortQueryParam<SortStringType extends string>(
//   sort = '-createdAt' as SortStringType,
// ): Record<SortStringType, 'ASC' | 'DESC'> {
//   return {
//     [sort.replace(/^-/, '')]: /^-/.test(sort) ? 'DESC' : 'ASC',
//   } as Record<SortStringType, 'ASC' | 'DESC'>;
// }-

export function parseSortQueryParam(sort = 'createdAt'): Record<string, any> {
  const sortArray = sort.split('-');
  const sortDirection = sortArray.length > 1 ? 'DESC' : 'ASC';

  if (sort.includes('.')) {
    const [relation, field] = sort.split('.');

    // remove - from relation if exists
    const relationName = relation.replace(/^-/, '');

    return {
      [relationName]: {
        [field]: sortDirection,
      },
    };
  }

  const sortObject = {
    [sortArray[sortArray.length - 1]]: sortDirection,
  };

  return sortObject;
}
