import { isComparisonObject } from '../parsers/parsers.js';

const getPrimitiveValue = (value) => {
  if (typeof value === 'string') {
    return `"${value}"`;
  }
  return value;
};

const getJsonData = (resultToArray, path = '') => {
  if (typeof resultToArray !== 'object' || resultToArray === null) {
    return resultToArray;
  }
  if (typeof resultToArray === 'object' && !Array.isArray(resultToArray)) {
    const array = Object.keys(resultToArray).map((currentKey) => {
      const value = getJsonData(resultToArray[currentKey], path);
      const resultValue = typeof resultToArray[currentKey] !== 'object' ? getPrimitiveValue(value) : value;
      return `"${currentKey}":${resultValue}`;
    });
    return `[{${array}}]`;
  } else {
    const array = resultToArray.map((item) => {
      if (isComparisonObject(item)) {
        const newPath = `${path}.${item.key}`.replace(/^\.+/, '');
        const filter = resultToArray.filter((value) => value.key === item.key);
        let operation = '';
        let value = getJsonData(item.value, newPath);
        if (!Array.isArray(item.value) && typeof item.value !== 'object') {
          value = getPrimitiveValue(value);
        }

        switch (item.operator) {
          case '+':
            operation = filter.length !== 2 ? 'added' : 'replaced';
            break;
          case '-':
            operation = filter.length !== 2 ? 'removed' : 'replaced by';
            break;
          case ' ':
            operation = 'no changed';
            break;
          case '':
            return Object.keys(item).reduce((acc, key) => {
              return acc + key + ': ' + item[key];
            }, '');
        }

        return `{"path":"${newPath}","operation":"${operation}","value":${value}}`;
      }
    }, resultToArray);
    return `[${array}]`;
  }
};

export const getResultToJson = (resultToArray) => getJsonData(resultToArray);