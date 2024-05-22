import _ from "lodash";

const getPrimitiveData = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  }
  if (_.isString(value)) {
    return `'${value}'`;
  }
  return value;
};

const setIterator = (tree, key = []) => {
  const format = tree.map((item) => {
    const keys = [...key, item.key];
    const path = keys.join('.');
    switch (item.operation) {
      case 'nested':
        return setIterator(item.value, keys);
      case 'changed':
        return `Property '${path}' was updated. From ${getPrimitiveData(
          item.value.removed,
        )} to ${getPrimitiveData(item.value.updated)}`;
      case 'deleted':
        return `Property '${path}' was removed`;
      case 'added':
        return `Property '${path}' was added with value: ${getPrimitiveData(
          item.value,
        )}`;
      case 'same':
        return null;
      default:
        throw new Error(`Unknown node status: ${item.operation}`);
    }
  });
  return format.filter(Boolean).join('\n');
};

const getPlainData = (tree) => setIterator(tree, []);

export default getPlainData;
