import fs from 'fs';
import path from 'path';
import parsers from './parsers/parsers.js';
import format from './formatters/formatters.js';

const getFileData = (filepath) => {
  return [
    // eslint-disable-next-line no-undef
    fs.readFileSync(path.resolve(process.cwd(), filepath), 'utf-8'),
    path.extname(filepath),
  ];
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
  return format(resultToArray, formatName);
};

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
      return {
        operator: comparison.operator,
        key: comparison.key,
        value: getResultToArray(
          arrayKeys,
          firstContentToArray[fileKey],
          secondContentToArray[fileKey],
        ),
      };
    }
    return getComparison(fileKey, firstContentToArray, secondContentToArray);
  });
  return getComparisonArray(result);
};

const getComparisonArray = (contentToArray) => {
  return contentToArray.reduce((acc, currentValue) => {
    if (currentValue.operator === 'comparisonObject') {
      acc.push(currentValue.value[0]);
      acc.push(currentValue.value[1]);
      return acc;
    }
    acc.push(currentValue);
    return acc;
  }, []);
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
        ? {
            operator: ' ',
            key: fileKey,
            value: getValidObject(firstContentToArray[fileKey]),
          }
        : {
            operator: 'comparisonObject',
            key: fileKey,
            value: [
              {
                operator: '-',
                key: fileKey,
                value: getValidObject(firstContentToArray[fileKey]),
              },
              {
                operator: '+',
                key: fileKey,
                value: getValidObject(secondContentToArray[fileKey]),
              },
            ],
          };
    }
    return {
      operator: ' ',
      key: fileKey,
      value: getValidObject(firstContentToArray[fileKey]),
    };
  } else if (
    isKeyExistsInOneArray(fileKey, firstContentToArray, secondContentToArray)
  ) {
    return {
      operator: '-',
      key: fileKey,
      value: getValidObject(firstContentToArray[fileKey]),
    };
  } else if (
    isKeyExistsInOneArray(fileKey, secondContentToArray, firstContentToArray)
  ) {
    return {
      operator: '+',
      key: fileKey,
      value: getValidObject(secondContentToArray[fileKey]),
    };
  }
  return {};
};

const getValidObject = (object) => {
  if (typeof object !== 'object' || object === null) {
    return object;
  }
  const keys = Object.keys(object);
  return keys.map((key) => {
    return {
      operator: ' ',
      key: key,
      value: getValidObject(object[key]),
    };
  });
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

export const isComparisonObject = (object) => {
  return (
    object.key !== undefined &&
    object.operator !== undefined &&
    object.value !== undefined
  );
};
