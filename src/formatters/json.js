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
  }

  const array = resultToArray.map((item) => {
    const newPath = `${path}.${item.key}`.replace(/^\.+/, '');
    const filter = resultToArray.filter((value) => value.key === item.key);

    const value = getJsonData(item.value, newPath);
    const resultValue = !Array.isArray(item.value) && typeof item.value !== 'object'
      ? getPrimitiveValue(value)
      : value;

    if (item.operator === '+') {
      const operation =  filter.length !== 2 ? 'added' : 'replaced';
      return `{"path":"${newPath}","operation":"${operation}","value":${resultValue}}`;
    }
    if (item.operator === '-') {
      const operation = filter.length !== 2 ? 'removed' : 'replaced by';
      return `{"path":"${newPath}","operation":"${operation}","value":${resultValue}}`;
    }
    const operation = 'no changed';
    return `{"path":"${newPath}","operation":"${operation}","value":${resultValue}}`;

  }, resultToArray);

  return `[${array}]`;
};

export default (resultToArray) => getJsonData(resultToArray);
