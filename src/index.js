import fs from 'fs';
import path from 'path';
import formatters from './formatters.js';

const getContentFile = (filepath) => {
  // eslint-disable-next-line no-undef
  return fs.readFileSync(path.resolve(process.cwd(), filepath), 'utf-8');
};

export default (firstPath, secondPath) => {
  const firstContent = getContentFile(firstPath);
  const secondContent = getContentFile(secondPath);
  const contentToArray = formatters(firstContent, secondContent);
  const resultToArray = getResultToArray(contentToArray);
  const resultString = getResultToString(resultToArray);
  return `{\n${resultString}}`;
};

const getResultToArray = (contentToArray) => {
  const filesKeys = generateKeys(contentToArray[0], contentToArray[1]);

  return filesKeys.map((fileKey) => getComparison(fileKey, contentToArray));
};

const getComparison = (fileKey, contentToArray) => {
  if (
    contentToArray[0][fileKey] !== undefined &&
    contentToArray[1][fileKey] !== undefined
  ) {
    if (contentToArray[0][fileKey] !== contentToArray[1][fileKey]) {
      return [
        ['-', fileKey, contentToArray[0][fileKey]],
        ['+', fileKey, contentToArray[1][fileKey]],
      ];
    }
    return [' ', fileKey, contentToArray[0][fileKey]];
  } else if (
    contentToArray[0][fileKey] !== undefined &&
    contentToArray[1][fileKey] === undefined
  ) {
    return ['-', fileKey, contentToArray[0][fileKey]];
  } else if (
    contentToArray[1][fileKey] !== undefined &&
    contentToArray[0][fileKey] === undefined
  ) {
    return ['+', fileKey, contentToArray[1][fileKey]];
  }
  return [];
};

export const generateKeys = (firsArr, secondArr) => {
  return Object.keys({ ...firsArr, ...secondArr }).sort();
};

const getResultToString = (resultToArray, otherString = '') => {
  return resultToArray.reduce((acc, element) => {
    if (typeof element[0] === 'string') {
      acc = `${acc}${element[0]} ${element[1]}: ${element[2]}\n`;
      return acc;
    } else {
      return getResultToString(element, acc);
    }
  }, otherString);
};
