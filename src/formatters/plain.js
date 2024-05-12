import { isComparisonObject } from '../parsers/parsers.js';

export const getPlainData = (resultToArray, path = '') => {
  if (typeof resultToArray === 'object' && !Array.isArray(resultToArray)) {
    return resultToArray;
  }
  const result = resultToArray
    .map((item) => {
      if (typeof item === 'object') {
        if (isComparisonObject(item)) {
          const trimmedPath = `${path}.${item.key}`.replace(/^\.+/, '');
          const res = `'${trimmedPath}'`;
          const filter = resultToArray.filter(
            (value) => value.key === item.key,
          );
          switch (item.operator) {
            case '+':
              if (filter.length !== 2) {
                const resultValue = getPrimitiveData(item.value);
                return `Property ${res} was added with value: ${resultValue}`;
              } else {
                return '';
              }
            case '-':
              if (filter.length !== 2) {
                return `Property ${res} was removed`;
              } else {
                const nextItem =
                  resultToArray.findIndex((findItem) => findItem === item) + 1;
                const nextValue = getPrimitiveData(
                  resultToArray[nextItem].value,
                );
                const primitiveItem = getPrimitiveData(item.value);
                return `Property ${res} was updated. From ${primitiveItem} to ${nextValue}`;
              }
            case ' ':
              if (typeof item.value === 'object') {
                return getPlainData(item.value, trimmedPath);
              }
          }
        }
      }
      return '';
    }, resultToArray)
    .filter((item) => item)
    .join('\n');

  return `${result}`;
};

const getPrimitiveData = (data) => {
  switch (true) {
    case typeof data === 'boolean' ||
      data === null ||
      typeof data === 'number' ||
      typeof data === 'undefined':
      return data;
    case typeof data === 'object':
      return '[complex value]';
    case typeof data === 'string':
      return `'${data}'`;
  }
};
