import {
  describe, expect, test,
} from '@jest/globals';
import fs from 'fs';
import path from 'path';
import * as process from 'process';
import { generateKeys, getDiffFiles } from '../src/index.js';
// import getDiffFiles from '../src/index.js';

const getFilePath = (filePath) => `__fixtures__/${filePath}`;

const contentFirst = {
  host: 'hexlet.io',
  timeout: 50,
  proxy: '123.234.53.22',
  follow: false,
};
const contentSecond = {
  timeout: 20,
  verbose: true,
  host: 'hexlet.io',
};

const readFixtureFile = (fileName) => fs.readFileSync(path.resolve(
  process.cwd(), getFilePath(fileName),
), 'utf8');

test('generateKeys', () => {
  expect(
    generateKeys(contentFirst, contentSecond),
  ).toEqual(['follow', 'host', 'proxy', 'timeout', 'verbose']);
});

const inputPaths = {
  firstPath: getFilePath('file3.json'),
  secondPath: getFilePath('file4.json'),
};

const testCases = [
  {
    format: 'stylish',
    expectedContent: readFixtureFile('resultStylish'),
    ...inputPaths,
  },
  {
    format: 'plain',
    expectedContent: readFixtureFile('resultPlain'),
    ...inputPaths,
  },
  {
    format: 'json',
    expectedContent: readFixtureFile('resultJson.json'),
    ...inputPaths,
  },
];

describe('getDiffFiles', () => {
  test.each(testCases)('differTest', ({ format, expectedContent, firstPath, secondPath }) => {
    expect(getDiffFiles(firstPath, secondPath, format)).toBe(expectedContent);
  });
});
