import { expect, test } from '@jest/globals';
import { generateKeys } from '../src/index.js';

test('generateKeys', () => {
  expect(
    generateKeys(
      '{\n"host": "hexlet.io",\n"timeout": 50,\n"proxy": "123.234.53.22",\n"follow": false\n}',
      '{\n"timeout": 20,\n"verbose": true,\n"host": "hexlet.io"\n}',
    ),
  ).toEqual(['follow', 'host', 'proxy', 'timeout', 'verbose']);
});
