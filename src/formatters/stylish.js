import _ from 'lodash';

const spacesCount = 4;
const offsetLeft = 2;

const setIndent = (depth) => ' '.repeat(depth * spacesCount - offsetLeft);

const stringify = (value, depth) => {
  if (!_.isObject(value)) {
    return `${value}`;
  }
  const keys = Object.keys(value);
  const output = keys.map(
    (key) => `${setIndent(depth + 1)}  ${key}: ${stringify(value[key], depth + 1)}`,
  );
  return `{\n${output.join('\n')}\n  ${setIndent(depth)}}`;
};

const setFormat = (tree, depth) => tree.map((item) => {
  const setString = (value, operator) => `${setIndent(depth)}${operator} ${item.key}: ${stringify(value, depth)}\n`;
  switch (item.operation) {
    case 'added':
      return setString(item.value, '+');
    case 'deleted':
      return setString(item.value, '-');
    case 'same':
      return setString(item.value, ' ');
    case 'changed':
      return `${setString(item.value.removed, '-')}${setString(item.value.updated, '+')}`;
    case 'nested':
      return `${setIndent(depth)}  ${item.key}: {\n${setFormat(item.value, depth + 1)
        .join('')}${setIndent(depth)}  }\n`;
  }
});

const getResultToStylish = (tree) => `{\n${setFormat(tree, 1).join('')}}`;

export default getResultToStylish;
