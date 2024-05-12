import { isComparisonObject } from '../parsers/parsers.js';

export const getResultToStylish = (resultToArray, depth = 1) => {
  const currentIdent = '  '.repeat(depth);
  const longIdent = '  '.repeat(depth + 1);
  const lastIndent = '  '.repeat(depth - 1);
  if (typeof resultToArray !== 'object' || resultToArray === null) {
    return resultToArray;
  }
  let string;
  if (typeof resultToArray === 'object' && !Array.isArray(resultToArray)) {
    string = Object.keys(resultToArray).map((currentKey) => {
      return (
        longIdent +
        currentKey +
        ': ' +
        getResultToStylish(resultToArray[currentKey], depth + 2)
      );
    });
  } else {
    string = resultToArray.map((item) => {
      if (typeof item === 'object') {
        if (item.operator === '') {
          item.operator = ' ';
        }
        if (!isComparisonObject(item)) {
          return (
            longIdent +
            resultToArray.find((findItem) => item === findItem) +
            ': ' +
            getResultToStylish(item, depth + 2)
          );
        } else {
          let line = `${currentIdent}${item.operator} ${item.key}: `;
          if (Array.isArray(item.value)) {
            return line + getResultToStylish(item.value, depth + 2);
          } else if (typeof item.value === 'object') {
            return line + getResultToStylish(item.value, depth + 2);
          }
          // if (item.value === '') {
          //   line = line.trimEnd();
          // }
          return `${line}${item.value}`;
        }
      }
      return `${longIdent}${item.operator} ${item.key}: ${item.value}`;
    }, resultToArray);
  }

  return '{\n' + string.join('\n') + `\n${lastIndent}}`;
};
