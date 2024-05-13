import yaml from 'js-yaml';
import json from './json.js';

export const isComparisonObject = (object) => object.key !== undefined
  && object.operator !== undefined
  && object.value !== undefined;

const getContentFile = (content, extension) => {
  switch (extension) {
    case '.json':
      // eslint-disable-next-line no-fallthrough
      return json(content);
    case '.yml':
    case '.yaml':
      return yaml.load(content, 'utf-8');
    default:
      throw new Error(`unknown file extension: ${extension}`);
  }
};

export default (fileContent) => getContentFile(fileContent[0], fileContent[1]);
