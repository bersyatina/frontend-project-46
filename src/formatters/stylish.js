import _ from 'lodash';

const setOperator = (operation) => {
  switch (operation) {
    case 'added':
    case 'updated':
      return '+';
    case 'deleted':
    case 'removed':
      return '-';
    default:
      return ' ';
  }
};

const isComparisonObject = (object) => object.key !== undefined
  && object.operation !== undefined
  && object.value !== undefined;

const getResultToStylish = (resultToArray, depth = 1) => {
  const currentIdent = '  '.repeat(depth);
  const longIdent = '  '.repeat(depth + 1);
  const lastIndent = '  '.repeat(depth - 1);
  if (typeof resultToArray !== 'object' || resultToArray === null) {
    return resultToArray;
  }
  const string = _.isPlainObject(resultToArray)
    ? Object.keys(resultToArray).map((currentKey) => {
      const resultString = getResultToStylish(resultToArray[currentKey], depth + 2);
      return `${longIdent}${currentKey}: ${resultString}`;
    })
    : resultToArray.map((item) => {
      const currentOperator = setOperator(item.operation);
      if (!isComparisonObject(item)) {
        const resultToStylish = getResultToStylish(item, depth + 2);
        return `${longIdent}: ${resultToStylish}`;
      }
      const line = `${currentIdent}${currentOperator} ${item.key}: `;
      if (typeof item.value === 'object') {
        return line + getResultToStylish(item.value, depth + 2);
      }
      return line + item.value;
    });
  const joinedString = string.join('\n');
  return `{\n${joinedString}\n${lastIndent}}`;
};

export default getResultToStylish;
