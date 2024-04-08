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
  const firstContentToArray = formatters(firstContent);
  const secondContentToArray = formatters(secondContent);
  const resultToArray = getResultToArray(
    firstContentToArray,
    secondContentToArray,
  );
  const resultString = getResultToString(resultToArray);
  return resultString;
};

const getResultToArray = (firstContentToArray, secondContentToArray) => {
  const filesKeys = generateKeys(firstContentToArray, secondContentToArray);
  return filesKeys.map((fileKey) => {
    if (isValidObject(fileKey, firstContentToArray, secondContentToArray)) {
      const comparison = getComparison(
        fileKey,
        firstContentToArray,
        secondContentToArray,
      );
      return [
        comparison[0],
        comparison[1],
        getResultToArray(
          firstContentToArray[fileKey],
          secondContentToArray[fileKey],
        ),
      ];
    }
    return getComparison(fileKey, firstContentToArray, secondContentToArray);
  });
};

const isValidObject = (fileKey, firstValue, secondValue) => {
  return (
    firstValue[fileKey] !== undefined &&
    secondValue[fileKey] !== undefined &&
    typeof firstValue[fileKey] === 'object' &&
    typeof secondValue[fileKey] === 'object'
  );
};

const getComparison = (fileKey, firstContentToArray, secondContentToArray) => {
  if (isKeyExistsInArrays(fileKey, firstContentToArray, secondContentToArray)) {
    if (
      isKeyNotExistsInArrays(fileKey, firstContentToArray, secondContentToArray)
    ) {
      return firstContentToArray[fileKey] === secondContentToArray[fileKey]
        ? [' ', fileKey, firstContentToArray[fileKey]]
        : [
            ['-', fileKey, firstContentToArray[fileKey]],
            ['+', fileKey, secondContentToArray[fileKey]],
          ];
    }
    return [' ', fileKey, firstContentToArray[fileKey]];
  } else if (
    isKeyExistsInOneArray(fileKey, firstContentToArray, secondContentToArray)
  ) {
    return ['-', fileKey, firstContentToArray[fileKey]];
  } else if (
    isKeyExistsInOneArray(fileKey, secondContentToArray, firstContentToArray)
  ) {
    return ['+', fileKey, secondContentToArray[fileKey]];
  }
  return [];
};

const isKeyExistsInOneArray = (fileKey, firstArray, secondArray) => {
  return (
    firstArray[fileKey] !== undefined && secondArray[fileKey] === undefined
  );
};

const isKeyExistsInArrays = (fileKey, firstArray, secondArray) => {
  return (
    firstArray[fileKey] !== undefined && secondArray[fileKey] !== undefined
  );
};

const isKeyNotExistsInArrays = (fileKey, firstArray, secondArray) => {
  return (
    typeof firstArray[fileKey] !== 'object' ||
    typeof secondArray[fileKey] !== 'object'
  );
};

export const generateKeys = (firsObj, secondObj) => {
  return Object.keys({ ...firsObj, ...secondObj }).sort();
};

const isComparisonObject = (data) => {
  return (
    data[0] !== undefined && data[1] !== undefined && data[2] !== undefined
  );
};

const getResultToString = (resultToArray, depth = 1) => {
  const string = resultToArray.map((item) => {
    const currentIdent = '  '.repeat(depth);
    const longIdent = '  '.repeat(depth + 1);
    if (typeof item === 'object') {
      if (!isComparisonObject(item)) {
        return (
          longIdent +
          resultToArray.find((findItem) => findItem === item) +
          ': ' +
          getResultToString(item, depth + 2)
        );
      } else {
        const line = `${currentIdent}${item[0]} ${item[1]}: `;
        return typeof item[2] === 'object'
          ? line + getResultToString(item[2], depth + 2)
          : line + item[2];
      }
    }
    return (
      longIdent +
      resultToArray.find((findItem) => item === findItem) +
      ': ' +
      item
    );
  }, resultToArray);
  return '{\n' + string.join('\n') + '\n}';
};
