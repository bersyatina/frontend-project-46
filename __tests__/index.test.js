import { expect, test } from '@jest/globals';
import * as index from '../src/index.js';

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

test('index', () => {
  expect(index.default('file1.json', 'file2.json')).toEqual(
    '{\n- follow: false\n  host: hexlet.io\n- proxy: 123.234.53.22\n- timeout: 50\n+ timeout: 20\n+ verbose: true\n}',
  );
});
