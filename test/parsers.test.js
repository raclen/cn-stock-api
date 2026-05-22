import test from 'node:test';
import assert from 'node:assert/strict';

import { FinanceError } from '../src/utils/error.js';
import { parseEastmoneyKlines } from '../src/sources/eastmoney.js';
import { parseSinaKlineResponse, parseSinaRealtimeText } from '../src/sources/sina.js';
import { mapKlineRows } from '../src/sources/xueqiu.js';

test('parseEastmoneyKlines maps csv rows', () => {
  const rows = parseEastmoneyKlines([
    '2026-05-20,100,101,102,99,12345,54321,3.0,1.0,1.0,0.5',
  ]);

  assert.deepEqual(rows[0], {
    date: '2026-05-20',
    open: 100,
    close: 101,
    high: 102,
    low: 99,
    volume: 12345,
    amount: 54321,
    amplitude: 3,
    changePct: 1,
    changeAmount: 1,
    turnoverRate: 0.5,
  });
});

test('parseSinaRealtimeText maps quote rows', () => {
  const text = 'var hq_str_sh600519="贵州茅台,1923.000,1900.000,1930.000,1940.000,1910.000,1929.000,1930.000,100,200,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2026-05-22,15:00:03";';
  const [row] = parseSinaRealtimeText(text);

  assert.equal(row.symbol, 'sh600519');
  assert.equal(row.name, '贵州茅台');
  assert.equal(row.price, 1930);
  assert.equal(row.date, '2026-05-22');
});

test('parseSinaKlineResponse maps jsonp payload', () => {
  const text = 'var _sh000001_240_1=( [{"day":"2026-05-22","open":"10.0","high":"11.0","low":"9.8","close":"10.8","volume":"1200"}] )';
  const [row] = parseSinaKlineResponse(text);

  assert.equal(row.date, '2026-05-22');
  assert.equal(row.open, 10);
  assert.equal(row.close, 10.8);
});

test('mapKlineRows maps xueqiu payload', () => {
  const [row] = mapKlineRows({
    column: ['timestamp', 'volume', 'open', 'high', 'low', 'close', 'percent', 'turnoverrate', 'amount'],
    item: [[1747872000000, 1000, 10, 11, 9.5, 10.8, 1.25, 0.6, 2000]],
  });

  assert.equal(row.date, '2025-05-22');
  assert.equal(row.high, 11);
  assert.equal(row.changePct, 1.25);
  assert.equal(row.amount, 2000);
});

test('FinanceError keeps metadata', () => {
  const error = new FinanceError('boom', {
    source: 'sina',
    code: 'ECONNRESET',
    status: 503,
  });

  assert.equal(error.name, 'FinanceError');
  assert.equal(error.source, 'sina');
  assert.equal(error.code, 'ECONNRESET');
  assert.equal(error.status, 503);
});
