import _ from 'lodash';
import { isComparisonObject } from '../parsers/parsers.js';

const getResultToStylish = (resultToArray, depth = 1) => {
  const currentIdent = '  '.repeat(depth);
  const longIdent = '  '.repeat(depth + 1);
  const lastIndent = '  '.repeat(depth - 1);
  if (typeof resultToArray !== 'object' || resultToArray === null) {
    return resultToArray;
  }

  const relatedData = {
    depth, longIdent, lastIndent, currentIdent,
  };
  if (_.isPlainObject(resultToArray)) {
    // eslint-disable-next-line no-use-before-define
    return getResultOfObject(resultToArray, relatedData);
  }
  // eslint-disable-next-line no-use-before-define
  const string = resultToArray.map((item) => getResultString(
    item,
    resultToArray,
    relatedData,
  ), resultToArray);

  const joinedString = string.join('\n');
  return `{\n${joinedString}\n${lastIndent}}`;
};

const getResultOfObject = (resultToArray, relatedData) => {
  const { depth, longIdent, lastIndent } = relatedData;
  const string = Object.keys(resultToArray).map((currentKey) => {
    const resultString = getResultToStylish(resultToArray[currentKey], depth + 2);
    return `${longIdent}${currentKey}: ${resultString}`;
  });
  const joinedString = string.join('\n');
  return `{\n${joinedString}\n${lastIndent}}`;
};

const setOperator = (operation) => {
  switch (operation) {
    case 'added':
      return '+';
    case 'deleted':
      return '-';
    default:
      return ' ';
  }
};

const getResultString = (item, resultToArray, relatedData) => {
  const { longIdent, currentIdent, depth } = relatedData;
  const currentItem = item;
  const currentOperator = currentItem.operation === ''
    ? ' '
    : setOperator(currentItem.operation);
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
};

export default getResultToStylish;
