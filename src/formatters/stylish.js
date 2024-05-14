import { isComparisonObject } from '../parsers/parsers.js';

const getResultToStylish = (resultToArray, depth = 1) => {
  const currentIdent = '  '.repeat(depth);
  const longIdent = '  '.repeat(depth + 1);
  const lastIndent = '  '.repeat(depth - 1);
  if (typeof resultToArray !== 'object' || resultToArray === null) {
    return resultToArray;
  }

  if (typeof resultToArray === 'object' && !Array.isArray(resultToArray)) {
    return getResultOfObject(resultToArray, depth, longIdent, lastIndent);
  }

  const string = resultToArray
    .map((item) => getResultString(
      item,
      resultToArray,
      longIdent,
      currentIdent,
      depth,
    ), resultToArray);

  const joinedString = string.join('\n');
  return `{\n${joinedString}\n${lastIndent}}`;
};

const getResultOfObject = (resultToArray, depth, longIdent, lastIndent) => {
  const string = Object.keys(resultToArray).map((currentKey) => {
    const resultString = getResultToStylish(resultToArray[currentKey], depth + 2);
    return `${longIdent}${currentKey}: ${resultString}`;
  });
  const joinedString = string.join('\n');
  return `{\n${joinedString}\n${lastIndent}}`;
};

const getResultString = (item, resultToArray, longIdent, currentIdent, depth) => {
  const currentItem = item;
  const currentOperator = currentItem.operator === ''
    ? ' '
    : currentItem.operator;
  if (typeof currentItem === 'object') {
    if (!isComparisonObject(currentItem)) {
      const filteredArray = resultToArray.find((findItem) => item === findItem);
      const resultToStylish = getResultToStylish(currentItem, depth + 2);
      return `${longIdent}${filteredArray}: ${resultToStylish}`;
    }
    const line = `${currentIdent}${currentOperator} ${currentItem.key}: `;

    if (typeof currentItem.value === 'object') {
      return line + getResultToStylish(currentItem.value, depth + 2);
    }
    return line + currentItem.value;
  }

  return `${longIdent}${currentOperator} ${currentItem.key}: ${currentItem.value}`;
};

export default getResultToStylish;
