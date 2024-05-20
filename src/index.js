import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import * as process from 'process';
import getParseData from './parsers/parsers.js';
import formatter from './formatters/formatter.js';

export const getFileData = (filepath) => [
  fs.readFileSync(path.resolve(process.cwd(), filepath), 'utf-8'),
  _.trim(path.extname(filepath), '.'),
];

const isKeyExistsInOneArray = (fileKey, firstArray, secondArray) => firstArray[fileKey]
  !== undefined && secondArray[fileKey] === undefined;

const isValueNotPlainObject = (
  fileKey,
  firstArray,
  secondArray,
) => !_.isPlainObject(firstArray[fileKey]) || !_.isPlainObject(secondArray[fileKey]);

const getComparison = (fileKey, firstContent, secondContent) => {
  const valueFirst = firstContent[fileKey];
  const valueSecond = secondContent[fileKey];
  if (firstContent[fileKey] !== undefined && secondContent[fileKey] !== undefined) {
    if (isValueNotPlainObject(fileKey, firstContent, secondContent)) {
      return valueFirst === valueSecond
        ? { operation: 'same', key: fileKey, value: valueFirst }
        : {
          operation: 'comparisonObject',
          key: fileKey,
          value: [
            { operation: 'removed', key: fileKey, value: valueFirst },
            { operation: 'updated', key: fileKey, value: valueSecond },
          ],
        };
    }
    return { operation: 'same', key: fileKey, value: valueFirst };
  }
  if (isKeyExistsInOneArray(fileKey, firstContent, secondContent)) {
    return { operation: 'deleted', key: fileKey, value: valueFirst };
  }
  if (isKeyExistsInOneArray(fileKey, secondContent, firstContent)) {
    return { operation: 'added', key: fileKey, value: valueSecond };
  }
  return {};
};

const getResultToArray = (filesKeys, firstContent, secondContent) => filesKeys.map((fileKey) => {
  if (isValueNotPlainObject(fileKey, firstContent, secondContent)) {
    return getComparison(fileKey, firstContent, secondContent);
  }
  const arrayKeys = _.sortBy(Object.keys({ ...firstContent[fileKey], ...secondContent[fileKey] }));
  const comparison = getComparison(fileKey, firstContent, secondContent);
  return {
    operation: comparison.operation,
    key: comparison.key,
    value: getResultToArray(arrayKeys, firstContent[fileKey], secondContent[fileKey]),
  };
}).reduce((acc, currentValue) => {
  if (currentValue.operation === 'comparisonObject') {
    return [...acc, ...currentValue.value];
  }
  return [...acc, currentValue];
}, []);

export default (firstPath, secondPath, formatName = 'stylish') => {
  const firstContent = getFileData(firstPath);
  const secondContent = getFileData(secondPath);

  const firstArray = getParseData(firstContent[0], firstContent[1]);
  const secondArray = getParseData(secondContent[0], secondContent[1]);
  const filesKeys = _.sortBy(Object.keys({ ...firstArray, ...secondArray }));

  const result = getResultToArray(filesKeys, firstArray, secondArray);
  return formatter(result, formatName);
};
