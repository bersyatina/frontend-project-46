import json from './parsers/json.js';
import yaml from 'js-yaml';

export default (fileContent) => {
  return getContentFile(fileContent[0], fileContent[1]);
};

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
