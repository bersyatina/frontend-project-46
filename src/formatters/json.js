import { isComparisonObject } from '../index.js';
import json from '../parsers/json.js';

export const getResultToJson = (resultToArray, path = '') => {
  if (typeof resultToArray === 'object' && !Array.isArray(resultToArray)) {
    return resultToArray;
  }
  const string = resultToArray.map((item) => {
    if (typeof item === 'object') {
      if (isComparisonObject(item)) {
        const newPath = `${path}.${item.key}`.replace(/^\.+/, '');
        const filter = resultToArray.filter((value) => value.key === item.key);
        let operation = '';
        let value = '';
        switch (item.operator) {
          case '+':
            operation = filter.length !== 2 ? 'added' : 'replaced';
            value = item.value;
            break;
          case '-':
            operation = filter.length !== 2 ? 'removed' : 'replaced by';
            value = item.value;
            break;
          case ' ':
            operation = 'no changed';
            value =
              typeof item.value === 'object'
                ? json(getResultToJson(item.value, newPath))
                : item.value;
        }

        return {
          path: newPath,
          operation,
          value,
        };
      }
    }
  }, resultToArray);
  return JSON.stringify(string);
};
