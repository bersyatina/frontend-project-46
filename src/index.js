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
  const result = filesKeys.map((fileKey) => {
    if (isValidObject(fileKey, firstContentToArray, secondContentToArray)) {
      const comparison = getComparison(
        fileKey,
        firstContentToArray,
        secondContentToArray,
      );
      return {
        operator: comparison[0],
        key: comparison[1],
        value: getResultToArray(
          firstContentToArray[fileKey],
          secondContentToArray[fileKey],
        ),
      };
    }
    return getComparison(fileKey, firstContentToArray, secondContentToArray);
  });
  // const replacedKeys = getReplacedKeys(result);
  return getComparisonArray(result);
};

const getComparisonArray = (contentToArray) => {
  const result = contentToArray.reduce((acc, currentValue) => {
    if (currentValue.operator === 'comparisonObject') {
      acc.push(currentValue.value[0]);
      acc.push(currentValue.value[1]);
      return acc;
    }
    acc.push(currentValue);
    return acc;
  }, []);

  console.log(result);
  console.log('end');
  return result;
};

const getReplacedKeys = (array) => {
  return array.map((item) => {
    if (item.operator === 'comparisonObject') {
      return item.key;
    }
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
        ? {
            operator: ' ',
            key: fileKey,
            value: firstContentToArray[fileKey],
          }
        : {
            operator: 'comparisonObject',
            key: fileKey,
            value: [
              {
                operator: '-',
                key: fileKey,
                value: firstContentToArray[fileKey],
              },
              {
                operator: '+',
                key: fileKey,
                value: secondContentToArray[fileKey],
              },
            ],
          };
    }
    return {
      operator: ' ',
      key: fileKey,
      value: firstContentToArray[fileKey],
    };
  } else if (
    isKeyExistsInOneArray(fileKey, firstContentToArray, secondContentToArray)
  ) {
    return {
      operator: '-',
      key: fileKey,
      value: firstContentToArray[fileKey],
    };
  } else if (
    isKeyExistsInOneArray(fileKey, secondContentToArray, firstContentToArray)
  ) {
    return {
      operator: '+',
      key: fileKey,
      value: secondContentToArray[fileKey],
    };
  }
  return {};
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

const isComparisonObject = (object) => {
  return (
    object.key !== undefined &&
    object.operator !== undefined &&
    object.value !== undefined
  );
};

const getResultToString = (resultToArray, depth = 1) => {
  console.log(resultToArray);
  const string = resultToArray.map((item) => {
    const currentIdent = '  '.repeat(depth);
    const longIdent = '  '.repeat(depth + 1);

    if (typeof item === 'object') {
      if (!isComparisonObject(item)) {
        return (
          longIdent +
          resultToArray.find((findItem) => item === findItem) +
          ': ' +
          getResultToString(item, depth + 2)
        );
      } else {
        const line = `${currentIdent}${item.operator} ${item.key}: `;
        return typeof item.value === 'object'
          ? line + getResultToString(item.value, depth + 2)
          : line + item.value;
      }
    }
    return `${longIdent}${item.operator} ${item.key}: ${item.value}`;
  }, resultToArray);
  const lastIndent = ' '.repeat(depth - 1);
  return '{\n' + string.join('\n') + `\n${lastIndent}}`;
};
