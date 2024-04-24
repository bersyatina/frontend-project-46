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
//
// const getFixturesPath = (fileName) =>
//   // eslint-disable-next-line no-undef
//   path.resolve(process.cwd() + '/__fixtures__/', fileName);

test('stylish', () => {
  expect(index.default('file3.json', 'file4.json', 'stylish')).toEqual(
    '{\n    common: {\n      + follow: false\n        setting1: Value 1\n      - setting2: 200\n      - setting3: true\n      + setting3: null\n      + setting4: blah blah\n      + setting5: {\n            key5: value5\n        }\n        setting6: {\n            doge: {\n              - wow: \n              + wow: so much\n            }\n            key: value\n          + ops: vops\n        }\n    }\n    group1: {\n      - baz: bas\n      + baz: bars\n        foo: bar\n      - nest: {\n            key: value\n        }\n      + nest: str\n    }\n  - group2: {\n        abc: 12345\n        deep: {\n            id: 45\n        }\n    }\n  + group3: {\n        deep: {\n            id: {\n                number: 45\n            }\n        }\n        fee: 100500\n    }\n}',
  );
});

test('json', () => {
  expect(index.default('file3.json', 'file4.json', 'json')).toEqual(
    '[{"path":"common","operation":"no changed","value":[{"path":"common.follow","operation":"added","value":false},{"path":"common.setting1","operation":"no changed","value":"Value 1"},{"path":"common.setting2","operation":"removed","value":200},{"path":"common.setting3","operation":"replaced by","value":true},{"path":"common.setting3","operation":"replaced","value":null},{"path":"common.setting4","operation":"added","value":"blah blah"},{"path":"common.setting5","operation":"added","value":[{"operator":" ","key":"key5","value":"value5"}]},{"path":"common.setting6","operation":"no changed","value":[{"path":"common.setting6.doge","operation":"no changed","value":[{"path":"common.setting6.doge.wow","operation":"replaced by","value":""},{"path":"common.setting6.doge.wow","operation":"replaced","value":"so much"}]},{"path":"common.setting6.key","operation":"no changed","value":"value"},{"path":"common.setting6.ops","operation":"added","value":"vops"}]}]},{"path":"group1","operation":"no changed","value":[{"path":"group1.baz","operation":"replaced by","value":"bas"},{"path":"group1.baz","operation":"replaced","value":"bars"},{"path":"group1.foo","operation":"no changed","value":"bar"},{"path":"group1.nest","operation":"replaced by","value":[{"operator":" ","key":"key","value":"value"}]},{"path":"group1.nest","operation":"replaced","value":"str"}]},{"path":"group2","operation":"removed","value":[{"operator":" ","key":"abc","value":12345},{"operator":" ","key":"deep","value":[{"operator":" ","key":"id","value":45}]}]},{"path":"group3","operation":"added","value":[{"operator":" ","key":"deep","value":[{"operator":" ","key":"id","value":[{"operator":" ","key":"number","value":45}]}]},{"operator":" ","key":"fee","value":100500}]}]',
  );
});

test('plain', () => {
  expect(index.default('file3.json', 'file4.json', 'plain')).toEqual(
    "Property 'common.follow' was added with value: false\n" +
      "Property 'common.setting2' was removed\n" +
      "Property 'common.setting3' was updated. From true to null\n" +
      "Property 'common.setting4' was added with value: 'blah blah'\n" +
      "Property 'common.setting5' was added with value: [complex value]\n" +
      "Property 'common.setting6.doge.wow' was updated. From '' to 'so much'\n" +
      "Property 'common.setting6.ops' was added with value: 'vops'\n" +
      "Property 'group1.baz' was updated. From 'bas' to 'bars'\n" +
      "Property 'group1.nest' was updated. From [complex value] to 'str'\n" +
      "Property 'group2' was removed\n" +
      "Property 'group3' was added with value: [complex value]",
  );
});
