import {describe, expect, it, test} from '@jest/globals';
import fs from 'fs';
import * as index from '../src/index.js';
import getDiffFiles from '../src/index.js';

const readFixtureFile = (filename) =>
  fs.readFileSync(`__fixtures__/${filename}`, 'utf8');

test('generateKeys', () => {
  expect(
    index.generateKeys(
      {
        host: 'hexlet.io',
        timeout: 50,
        proxy: '123.234.53.22',
        follow: false,
      },
      {
        timeout: 20,
        verbose: true,
        host: 'hexlet.io',
      },
    ),
  ).toEqual(['follow', 'host', 'proxy', 'timeout', 'verbose']);
});

const FilesPath = (filePath1, filePath2) => [
  `__fixtures__/${filePath1}`,
  `__fixtures__/${filePath2}`,
];

const expectedResult = (stylishFile, plainFile, jsonFile) => ({
  stylish: readFixtureFile(stylishFile),
  plain: readFixtureFile(plainFile),
  json: readFixtureFile(jsonFile),
});

const testCases = [
  {
    name: 'differ files',
    inputFiles: FilesPath('file3.json', 'file4.json'),
    expected: expectedResult('resultStylish', 'resultPlain', 'resultJson.json'),
  },
];

describe('getDiffFiles', () => {
  testCases.forEach((testCase) => {
    it(`${testCase.name}`, () => {
      const {inputFiles, expected} = testCase;
      Object.keys(expected).forEach((format) => {
        const actualResult = getDiffFiles(...inputFiles, format);
        expect(actualResult).toBe(expected[format]);
      });
    });
  });
});
