import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import getParseData from './parsers/parsers.js';
import formatter from './formatters/formatter.js';
import * as process from 'process';

export const getFileData = (filepath) => [
  fs.readFileSync(path.resolve(process.cwd(), filepath), 'utf-8'),
  path.extname(filepath),
];

const getComparisonArray = (contentToArray) => contentToArray.reduce((acc, currentValue) => {
  if (currentValue.operation === 'comparisonObject') {
    return [...acc, ...currentValue.value];
  }
  return [...acc, currentValue];
}, []);

const isKeyExistsInOneArray = (fileKey, firstArray, secondArray) => firstArray[fileKey]
  !== undefined && secondArray[fileKey] === undefined;

const isKeyExistsInArrays = (fileKey, firstArray, secondArray) => firstArray[fileKey]
  !== undefined && secondArray[fileKey] !== undefined;

const isValueNotPlainObject = (
  fileKey,
  firstArray,
  secondArray,
) => !_.isPlainObject(firstArray[fileKey]) || !_.isPlainObject(secondArray[fileKey]);

const setComparisonObject = (operation, key, value) => ({ operation, key, value });

const getComparison = (fileKey, firstContent, secondContent) => {
  const valueFirst = firstContent[fileKey];
  const valueSecond = secondContent[fileKey];
  if (isKeyExistsInArrays(fileKey, firstContent, secondContent)) {
    if (isValueNotPlainObject(fileKey, firstContent, secondContent)) {
      const removeObj = setComparisonObject('deleted', fileKey, valueFirst);
      const addedObj = setComparisonObject('added', fileKey, valueSecond);
      const oldObject = setComparisonObject('same', fileKey, valueFirst);
      const compObj = setComparisonObject('comparisonObject', fileKey, [
        removeObj,
        addedObj,
      ]);
      return valueFirst === valueSecond ? oldObject : compObj;
    }
    return setComparisonObject('same', fileKey, valueFirst);
  }
  if (isKeyExistsInOneArray(fileKey, firstContent, secondContent)) {
    return setComparisonObject('deleted', fileKey, valueFirst);
  }
  if (isKeyExistsInOneArray(fileKey, secondContent, firstContent)) {
    return setComparisonObject('added', fileKey, valueSecond);
  }
  return {};
};

export const generateKeys = (firsObj, secondObj) => _.sortBy(Object.keys({
  ...firsObj, ...secondObj,
}));

const getResultToArray = (filesKeys, firstContent, secondContent) => {
  const result = filesKeys.map((fileKey) => {
    if (isValueNotPlainObject(fileKey, firstContent, secondContent)) {
      return getComparison(fileKey, firstContent, secondContent);
    }
    const arrayKeys = generateKeys(firstContent[fileKey],secondContent[fileKey]);
    const comparison = getComparison(fileKey, firstContent, secondContent);
    return setComparisonObject(
      comparison.operation,
      comparison.key,
      getResultToArray(arrayKeys, firstContent[fileKey], secondContent[fileKey],
    ));    
  });
  return getComparisonArray(result);
};

export default (firstPath, secondPath, formatName = 'stylish') => {
  const firstContent = getFileData(firstPath);
  const secondContent = getFileData(secondPath);

  const firstArray = getParseData(firstContent);
  const secondArray = getParseData(secondContent);
  const filesKeys = generateKeys(firstArray, secondArray);

  const result = getResultToArray(filesKeys, firstArray, secondArray);
  return formatter(result, formatName);
};

export const setOperator = (operation) => {
  switch (operation) {
    case 'added':
      return '+';
    case 'deleted':
      return '-';
    default:
      return ' ';
  }
};
