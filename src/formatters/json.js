import { isComparisonObject } from '../index.js';
import json from '../parsers/json.js';

export const getResultToJson = (resultToArray, path = '') => {
  if (typeof resultToArray !== 'object' || resultToArray === null) {
    return resultToArray;
  }
  let string;
  if (typeof resultToArray === 'object' && !Array.isArray(resultToArray)) {
    string = Object.keys(resultToArray).map((currentKey) => {
      // console.log(`{"${currentKey}":${resultToArray[currentKey]}}`);
      let value = getResultToJson(resultToArray[currentKey], path);
      if (typeof resultToArray[currentKey] !== 'object') {
        value = getPrimitiveValue(value);
      }

      return `{"${currentKey}":${value}}`;
    });
    string = string.join(',');
    // console.log(string.length);
    // console.log(string);
  } else {
    string = resultToArray.map((item) => {
      if (typeof item === 'object') {
        if (isComparisonObject(item)) {
          const newPath = `${path}.${item.key}`.replace(/^\.+/, '');
          const filter = resultToArray.filter(
            (value) => value.key === item.key,
          );
          let operation = '';
          let value = getResultToJson(item.value, newPath);

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
                return acc + key + ':' + `"${item[key]}"`;
              }, '');
          }
          console.log(value);
          return `{"path":"${newPath}","operation":"${operation}","value":${value}}`;
        }
      }
    }, resultToArray);
  }
  // console.log(string);
  return `[${string}]`;
};

const getPrimitiveValue = (value) => {
  return typeof value === 'string' ? `"${value}"` : value;
};
