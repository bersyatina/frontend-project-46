import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import getParseData from './parsers/parsers.js';
import formatter from './formatters/formatter.js';

const getFileData = (filepath) => [
  // eslint-disable-next-line no-undef
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
  fileKey, firstArray, secondArray
) => !_.isPlainObject(firstArray[fileKey]) || !_.isPlainObject(secondArray[fileKey]);

const setComparisonObject = (operation, key, value) => ({ operation, key, value });

const getComparison = (fileKey, firstContentToArray, secondContentToArray) => {
  const valueFirst = firstContentToArray[fileKey];
  const valueSecond = secondContentToArray[fileKey];
  if (isKeyExistsInArrays(fileKey, firstContentToArray, secondContentToArray)) {
    if (isValueNotPlainObject(fileKey, firstContentToArray, secondContentToArray)) {
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
  if (isKeyExistsInOneArray(fileKey, firstContentToArray, secondContentToArray)) {
    return setComparisonObject('deleted', fileKey, valueFirst);
  }
  if (isKeyExistsInOneArray(fileKey, secondContentToArray, firstContentToArray)) {
    return setComparisonObject('added', fileKey, valueSecond);
  }
  return {};
};

export const generateKeys = (firsObj, secondObj) => _.sortBy(Object.keys({
  ...firsObj, ...secondObj,
}));

const isValidObject = (fileKey, firstValue, secondValue) => firstValue[fileKey] !== undefined
  && secondValue[fileKey] !== undefined
  && typeof firstValue[fileKey] === 'object'
  && typeof secondValue[fileKey] === 'object';

const getResultToArray = (
  filesKeys,
  firstContentToArray,
  secondContentToArray,
) => {
  const result = filesKeys.map((fileKey) => {
    if (isValidObject(fileKey, firstContentToArray, secondContentToArray)) {
      const arrayKeys = generateKeys(
        firstContentToArray[fileKey],
        secondContentToArray[fileKey],
      );
      const comparison = getComparison(
        fileKey,
        firstContentToArray,
        secondContentToArray,
      );
      return setComparisonObject(comparison.operation, comparison.key, getResultToArray(
        arrayKeys,
        firstContentToArray[fileKey],
        secondContentToArray[fileKey],
      ));
    }
    return getComparison(fileKey, firstContentToArray, secondContentToArray);
  });
  return getComparisonArray(result);
};

export default (firstPath, secondPath, formatName = 'stylish') => {
  const firstContent = getFileData(firstPath);
  const secondContent = getFileData(secondPath);

  const firstContentToArray = getParseData(firstContent);
  const secondContentToArray = getParseData(secondContent);
  const filesKeys = generateKeys(firstContentToArray, secondContentToArray);

  const resultToArray = getResultToArray(
    filesKeys,
    firstContentToArray,
    secondContentToArray,
  );
  return formatter(resultToArray, formatName);
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
