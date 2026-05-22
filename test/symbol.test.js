import test from 'node:test';
import assert from 'node:assert/strict';

import { normalizeSinaSymbol, normalizeSymbols, tushareToSina } from '../src/utils/symbol.js';

test('tushareToSina converts tushare symbols', () => {
  assert.equal(tushareToSina('600519.SH'), 'sh600519');
  assert.equal(tushareToSina('000001.SZ'), 'sz000001');
});

test('normalizeSinaSymbol accepts supported market prefixes', () => {
  assert.equal(normalizeSinaSymbol('SH600519'), 'sh600519');
  assert.equal(normalizeSinaSymbol('sz000001'), 'sz000001');
});

test('normalizeSymbols always returns an array', () => {
  assert.deepEqual(normalizeSymbols('sh600519'), ['sh600519']);
  assert.deepEqual(normalizeSymbols(['sh600519', 'sz000001']), ['sh600519', 'sz000001']);
});
