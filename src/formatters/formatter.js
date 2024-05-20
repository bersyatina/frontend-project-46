import { getResultToStylish } from './stylish.js';
import getResultToJson from './json.js';
import getPlainData from './plain.js';

export default (resultContent, format = 'stylish') => {
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
