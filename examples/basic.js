import { eastmoney, sina, xueqiu } from '../src/index.js';

const eastmoneyBars = await eastmoney.getKline({
  symbol: 'NDX100',
  market: 100,
  beg: '20250101',
  end: '20250522',
});

console.log('eastmoney bars:', eastmoneyBars.slice(0, 2));

const sinaQuote = await sina.getRealtime('sh000001');
console.log('sina quote:', sinaQuote);

xueqiu.setAuth({
  xqat: process.env.XUEQIU_XQAT,
  u: process.env.XUEQIU_U,
});

const xueqiuBars = await xueqiu.getKline({
  symbol: '.IXIC',
  begin: Date.now(),
  period: 'day',
  count: -5,
});

console.log('xueqiu bars:', xueqiuBars);
