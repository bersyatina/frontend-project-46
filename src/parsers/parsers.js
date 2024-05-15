import yaml from 'js-yaml';
import json from './json.js';

export const isComparisonObject = (object) => object.key !== undefined
  && object.operation !== undefined
  && object.value !== undefined;

const getContentFile = (content, extension) => {
  switch (extension) {
    case '.json':
      return json(content);
    case '.yml':
    case '.yaml':
      return yaml.load(content, 'utf-8');
    default:
      throw new Error(`unknown file extension: ${extension}`);
  }
};

export default (fileContent) => getContentFile(fileContent[0], fileContent[1]);
