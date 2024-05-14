import { isComparisonObject } from '../parsers/parsers.js';

const getPrimitiveData = (data) => {
  switch (true) {
    case typeof data === 'boolean'
    || data === null
    || typeof data === 'number'
    || typeof data === 'undefined': return data;
    case typeof data === 'object':
      return '[complex value]';
    default:
      return `'${data}'`;
  }
};

const setRemovedOrUpdatedString = (resultToArray, item, filter, res) => {
  if (filter.length !== 2) {
    return `Property ${res} was removed`;
  }
  const nextItem = resultToArray.findIndex((findItem) => findItem === item) + 1;
  const nextValue = getPrimitiveData(
    resultToArray[nextItem].value,
  );
  const primitiveItem = getPrimitiveData(item.value);
  return `Property ${res} was updated. From ${primitiveItem} to ${nextValue}`;
}

const getPlainData = (resultToArray, path = '') => {
  if (typeof resultToArray === 'object' && !Array.isArray(resultToArray)) {
    return resultToArray;
  }
  const result = resultToArray
    .map((item) => {
      if (isComparisonObject(item)) {
        const trimmedPath = `${path}.${item.key}`.replace(/^\.+/, '');
        const res = `'${trimmedPath}'`;
        const filter = resultToArray.filter(
          (value) => value.key === item.key,
        );
        switch (true) {
          case item.operator === '+' && filter.length !== 2:
            const resultValue = getPrimitiveData(item.value);
            return `Property ${res} was added with value: ${resultValue}`;
          case item.operator === '-':
            return setRemovedOrUpdatedString(resultToArray, item, filter, res);
          case item.operator === ' ' && typeof item.value === 'object':
            return getPlainData(item.value, trimmedPath);            
        }
      }
      return '';
    }, resultToArray)
    .filter((item) => item)
    .join('\n');

  return `${result}`;
};

export default getPlainData;
