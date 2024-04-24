import { isComparisonObject } from '../index.js';

export const getResultToStylish = (resultToArray, depth = 1) => {
  if (typeof resultToArray === 'object' && !Array.isArray(resultToArray)) {
    return resultToArray;
  }
  const string = resultToArray.map((item) => {
    const currentIdent = '  '.repeat(depth);
    const longIdent = '  '.repeat(depth + 1);

    if (typeof item === 'object') {
      if (!isComparisonObject(item)) {
        return (
          longIdent +
          resultToArray.find((findItem) => item === findItem) +
          ': ' +
          getResultToStylish(item, depth + 2)
        );
      } else {
        const line = `${currentIdent}${item.operator} ${item.key}: `;
        if (Array.isArray(item.value)) {
          return line + getResultToStylish(item.value, depth + 2);
        } else if (typeof item.value === 'object') {
          return line + getResultToStylish(item.value, depth + 2);
        }
        return line + item.value;
      }
    }
    return `${longIdent}${item.operator} ${item.key}: ${item.value}`;
  }, resultToArray);
  const lastIndent = '  '.repeat(depth - 1);
  return '{\n' + string.join('\n') + `\n${lastIndent}}`;
};
