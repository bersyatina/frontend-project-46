const getPrimitiveData = (data) => {
  switch (true) {
    case typeof data === 'string':
      return `'${data}'`;
    case data instanceof Object:
      return '[complex value]';
    default:
      return data;
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
};

const getPlainData = (resultToArray, path = '') => {
  const result = resultToArray
    .map((item) => {
      const trimmedPath = `${path}.${item.key}`.replace(/^\.+/, '');

      const res = `'${trimmedPath}'`;
      const filter = resultToArray.filter(
        (value) => value.key === item.key,
      );
      const resultValue = getPrimitiveData(item.value);
      switch (true) {
        case (item.operation === 'added' && filter.length !== 2):
          return `Property ${res} was added with value: ${resultValue}`;
        case item.operation === 'deleted':
          return setRemovedOrUpdatedString(resultToArray, item, filter, res);
        case (item.operation === 'same' && typeof item.value === 'object'):
          return getPlainData(item.value, trimmedPath);
        default:
          return '';
      }
    }, resultToArray)
    .filter((item) => item)
    .join('\n');

  return `${result}`;
};

export default getPlainData;
