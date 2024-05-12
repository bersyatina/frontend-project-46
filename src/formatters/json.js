import { isComparisonObject } from '../index.js';

const getPrimitiveValue = (value) => {
  return typeof value === 'string' ? `"${value}"` : value;
};

export const getResultToJson = (resultToArray) => {
  return getJsonData(resultToArray);
};

const getJsonData = (resultToArray, path = '') => {
  if (typeof resultToArray !== 'object' || resultToArray === null) {
    return resultToArray;
  }
  let string;
  if (typeof resultToArray === 'object' && !Array.isArray(resultToArray)) {
    string = Object.keys(resultToArray).map((currentKey) => {
      let value = getJsonData(resultToArray[currentKey], path);
      if (typeof resultToArray[currentKey] !== 'object') {
        value = getPrimitiveValue(value);
      }
      return `"${currentKey}":${value}`;
    });
    string = `{${string}}`;
  } else {
    string = resultToArray.map((item) => {
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
  }

  return `[${string}]`;
};
