import fs from 'fs';
import path from 'path';
import formatters from './formatters.js';

const getFileData = (filepath) => {
  return [
    // eslint-disable-next-line no-undef
    fs.readFileSync(path.resolve(process.cwd(), filepath), 'utf-8'),
    path.extname(filepath),
  ];
};

export default (firstPath, secondPath, format = 'stylish') => {
  const firstContent = getFileData(firstPath);
  const secondContent = getFileData(secondPath);
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

export const generateKeys = (firsObj, secondObj) => {
  return Object.keys({ ...firsObj, ...secondObj }).sort();
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
