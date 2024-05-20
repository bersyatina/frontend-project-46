const getPrimitiveData = (data) => {
  switch (true) {
    case data instanceof Object:
      return '[complex value]';
    case typeof data === 'string':
      return `'${data}'`;
    default:
      return `${data}`;
  }
};

const setUpdatedString = (resultToArray, index, stringPath) => {
  const nextValue = getPrimitiveData(
    resultToArray[index + 1].value,
  );
  const primitiveItem = getPrimitiveData(resultToArray[index].value);
  return `Property '${stringPath}' was updated. From ${primitiveItem} to ${nextValue}`;
};

const getPlainData = (resultToArray, path = []) => resultToArray
  .map((item, index) => {
    const stringPath = [...path, item.key].join('.');
    const resultValue = getPrimitiveData(item.value);
    switch (item.operation) {
      case 'added':
        return `Property '${stringPath}' was added with value: ${resultValue}`;
      case 'deleted':
        return `Property '${stringPath}' was removed`;
      case 'removed':
        return setUpdatedString(resultToArray, index, stringPath);
      case 'same':
        if (typeof item.value !== 'object') {
          break;
        }
        return getPlainData(item.value, [...path, item.key]);
    }
    return '';
  }, resultToArray)
  .filter((item) => item)
  .join('\n');

export default getPlainData;
