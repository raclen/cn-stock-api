import { createBrowserHeaders, http } from '../utils/request.js';
import { wrapRequestError } from '../utils/error.js';

function toNumber(value) {
  if (value === undefined || value === null || value === '' || value === '-') {
    return undefined;
  }

  const number = Number(value);
  return Number.isNaN(number) ? undefined : number;
}

export function parseEastmoneyKlines(klines = []) {
  return klines.map((line) => {
    const [date, open, close, high, low, volume, amount, amplitude, changePct, changeAmount, turnoverRate] = String(line).split(',');

    return {
      date,
      open: toNumber(open),
      close: toNumber(close),
      high: toNumber(high),
      low: toNumber(low),
      volume: toNumber(volume),
      amount: toNumber(amount),
      amplitude: toNumber(amplitude),
      changePct: toNumber(changePct),
      changeAmount: toNumber(changeAmount),
      turnoverRate: toNumber(turnoverRate),
    };
  });
}

export async function getKline({
  symbol,
  market,
  beg = '19900101',
  end = '20500101',
  klt = 101,
  fqt = 1,
  limit = 1000000,
}) {
  if (symbol === undefined || market === undefined) {
    throw new Error('eastmoney.getKline requires symbol and market');
  }

  try {
    const response = await http.get('https://push2his.eastmoney.com/api/qt/stock/kline/get', {
      params: {
        secid: `${market}.${symbol}`,
        fields1: 'f1,f2,f3,f4,f5,f6',
        fields2: 'f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61',
        klt,
        fqt,
        beg,
        end,
        lmt: limit,
        _: Date.now(),
      },
      headers: createBrowserHeaders({
        Referer: 'https://quote.eastmoney.com/',
      }),
    });

    const klines = response?.data?.data?.klines;

    if (!Array.isArray(klines)) {
      throw new Error('Eastmoney response does not contain klines');
    }

    return parseEastmoneyKlines(klines);
  } catch (error) {
    wrapRequestError('eastmoney', error, 'Failed to fetch eastmoney kline');
  }
}
