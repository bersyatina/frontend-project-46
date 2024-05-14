import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import parsers from './parsers/parsers.js';
import getResultToStylish from './formatters/stylish.js';
import getResultToJson from './formatters/json.js';
import getPlainData from './formatters/plain.js';

const getFileData = (filepath) => [
  // eslint-disable-next-line no-undef
  fs.readFileSync(path.resolve(process.cwd(), filepath), 'utf-8'),
  path.extname(filepath),
];

const getComparisonArray = (contentToArray) => contentToArray.reduce((acc, currentValue) => {
  if (currentValue.operator === 'comparisonObject') {
    return [...acc, currentValue.value[0], currentValue.value[1]];
  }
  return [...acc, currentValue];
}, []);

const isKeyExistsInOneArray = (fileKey, firstArray, secondArray) => firstArray[fileKey]
  !== undefined && secondArray[fileKey] === undefined;

const isKeyExistsInArrays = (fileKey, firstArray, secondArray) => firstArray[fileKey]
  !== undefined && secondArray[fileKey] !== undefined;

const isKeyNotExistsInArrays = (fileKey, firstArray, secondArray) => typeof firstArray[fileKey]
  !== 'object' || typeof secondArray[fileKey] !== 'object';

const setComparisonObject = (operator, key, value) => {
  const newComparisonObject = {};
  newComparisonObject.operator = operator;
  newComparisonObject.key = key;
  newComparisonObject.value = value;
  return newComparisonObject;
};

const getComparison = (fileKey, firstContentToArray, secondContentToArray) => {
  if (isKeyExistsInArrays(fileKey, firstContentToArray, secondContentToArray)) {
    if (isKeyNotExistsInArrays(fileKey, firstContentToArray, secondContentToArray)) {
      return firstContentToArray[fileKey] === secondContentToArray[fileKey]
        ? setComparisonObject(' ', fileKey, firstContentToArray[fileKey])
        : setComparisonObject('comparisonObject', fileKey, [
          setComparisonObject('-', fileKey, firstContentToArray[fileKey]),
          setComparisonObject('+', fileKey, secondContentToArray[fileKey]),
        ]);
    }
    return setComparisonObject(' ', fileKey, firstContentToArray[fileKey]);
  }
  if (isKeyExistsInOneArray(fileKey, firstContentToArray, secondContentToArray)) {
    return setComparisonObject('-', fileKey, firstContentToArray[fileKey]);
  }
  if (isKeyExistsInOneArray(fileKey, secondContentToArray, firstContentToArray)) {
    return setComparisonObject('+', fileKey, secondContentToArray[fileKey]);
  }
  return {};
};

export const generateKeys = (firsObj, secondObj) => _.sortBy(Object.keys({
  ...firsObj, ...secondObj,
}));

const formatContent = (resultContent, format = 'stylish') => {
  switch (format) {
    case 'stylish':
      return getResultToStylish(resultContent);
    case 'json':
      return getResultToJson(resultContent);
    case 'plain':
      return getPlainData(resultContent);
    default:
      throw new Error(`The format is not defined: ${format}`);
  }
};

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
      return setComparisonObject(comparison.operator, comparison.key, getResultToArray(
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

  const firstContentToArray = parsers(firstContent);
  const secondContentToArray = parsers(secondContent);
  const filesKeys = generateKeys(firstContentToArray, secondContentToArray);

  const resultToArray = getResultToArray(
    filesKeys,
    firstContentToArray,
    secondContentToArray,
  );
  return formatContent(resultToArray, formatName);
};
