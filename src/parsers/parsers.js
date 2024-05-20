import yaml from 'js-yaml';
import json from './json.js';

export default (content, extension) => {
  switch (extension) {
    case 'json':
      return json(content);
    case 'yml':
    case 'yaml':
      return yaml.load(content, 'utf-8');
    default:
      throw new Error(`unknown file extension: ${extension}`);
  }
};
