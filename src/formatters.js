import json from './parsers/json.js';

export default (firstContent, secondContent, format) => {
  let firstParsedData, secondParsedData;

  switch (format) {
    default:
      firstParsedData = json(firstContent);
      secondParsedData = json(secondContent);
  }

  return [firstParsedData, secondParsedData];
};
