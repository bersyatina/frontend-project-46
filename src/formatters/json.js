const getPrimitiveValue = (value) => {
  if (typeof value === 'string') {
    return `"${value}"`;
  }
  return value;
};

const setOperation = (operator, filter) => {
  switch (operator) {
    case '+':
      return filter.length !== 2 ? 'added' : 'replaced';
    case '-':
      return filter.length !== 2 ? 'removed' : 'replaced by';
    default:
      return 'no changed';
  }
};

const setPathOfArray = (item, value, filter, newPath) => {
  const resultValue = !Array.isArray(item.value) && typeof item.value !== 'object'
    ? getPrimitiveValue(value)
    : value;
  const operation = setOperation(item.operator, filter);
  return `{"path":"${newPath}","operation":"${operation}","value":${resultValue}}`;
};

const setPathOfObject = (resultToArray, currentKey, value) => {
  const resultValue = typeof resultToArray[currentKey] !== 'object' ? getPrimitiveValue(value) : value;
  return `"${currentKey}":${resultValue}`;
};

const getJsonData = (resultToArray, path = '') => {
  if (typeof resultToArray !== 'object' || resultToArray === null) {
    return resultToArray;
  }
  if (typeof resultToArray === 'object' && !Array.isArray(resultToArray)) {
    const array = Object.keys(resultToArray).map((currentKey) => {
      const value = getJsonData(resultToArray[currentKey], path);
      return setPathOfObject(resultToArray, currentKey, value);
    });
    return `[{${array}}]`;
  }

  const array = resultToArray.map((item) => {
    const newPath = `${path}.${item.key}`.replace(/^\.+/, '');
    const filter = resultToArray.filter((value) => value.key === item.key);
    const value = getJsonData(item.value, newPath);
    return setPathOfArray(item, value, filter, newPath);
  }, resultToArray);

  return `[${array}]`;
};

export default (resultToArray) => getJsonData(resultToArray);
