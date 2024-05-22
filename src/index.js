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

const getResultToArray = (firstContent, secondContent) => {
  const arrayKeys = _.sortBy(Object.keys({...firstContent, ...secondContent}));
  return arrayKeys.map((key) => {
    const firstValue = firstContent[key];
    const secondValue = secondContent[key];
    
    if (_.isEqual(firstValue, secondValue)) {
      return {operation: 'same', key, value: firstValue}
    }

    if (_.isPlainObject(firstValue) && _.isPlainObject(secondValue)) {
      return {
        operation: 'nested',
        key,
        value: getResultToArray(firstValue, secondValue),
      }
    }

    if (firstValue === undefined && secondValue !== undefined) {
      return {operation: 'added', key, value: secondValue};
    }

    if (secondValue === undefined && firstValue !== undefined) {
      return {operation: 'deleted', key, value: firstValue};
    }

    return {
      operation: 'changed',
      key,
      value: { removed: firstValue, updated: secondValue },
    }
  });
};

export default (firstPath, secondPath, formatName = 'stylish') => {
  const firstContent = getFileData(firstPath);
  const secondContent = getFileData(secondPath);

  const firstArray = getParseData(...firstContent);
  const secondArray = getParseData(...secondContent);

  const result = getResultToArray(firstArray, secondArray);
  return formatter(result, formatName);
};
