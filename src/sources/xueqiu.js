import { createBrowserHeaders, http } from '../utils/request.js';
import { wrapRequestError } from '../utils/error.js';

let authState = {
  xqat: undefined,
  u: undefined,
  cookie: undefined,
};

function toNumber(value) {
  if (value === undefined || value === null || value === '' || value === '-') {
    return undefined;
  }

  const number = Number(value);
  return Number.isNaN(number) ? undefined : number;
}

function formatDate(timestamp) {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date.toISOString().slice(0, 10);
}

function getCookieHeader() {
  if (authState.cookie) {
    return authState.cookie;
  }

  if (authState.xqat && authState.u) {
    return `xqat=${authState.xqat};u=${authState.u}`;
  }

  throw new Error('xueqiu auth is required, call xueqiu.setAuth({ xqat, u }) first');
}

export function setAuth({ xqat, u, cookie }) {
  authState = {
    xqat,
    u,
    cookie,
  };
}

export function mapKlineRows(payload) {
  const columns = payload?.column;
  const items = payload?.item;

  if (!Array.isArray(columns) || !Array.isArray(items)) {
    throw new Error('Invalid xueqiu kline payload');
  }

  return items.map((row) => {
    const mapped = Object.fromEntries(columns.map((key, index) => [key, row[index]]));

    return {
      date: formatDate(mapped.timestamp),
      open: toNumber(mapped.open),
      close: toNumber(mapped.close),
      high: toNumber(mapped.high),
      low: toNumber(mapped.low),
      volume: toNumber(mapped.volume),
      amount: toNumber(mapped.amount),
      changePct: toNumber(mapped.percent),
      turnoverRate: toNumber(mapped.turnoverrate),
    };
  });
}

export async function getKline({
  symbol,
  begin = Date.now(),
  period = 'day',
  count = -120,
  indicator = 'kline,pe,pb,ps,pcf,market_capital,agt,ggt,balance',
}) {
  if (!symbol) {
    throw new Error('xueqiu.getKline requires symbol');
  }

  try {
    const response = await http.get('https://stock.xueqiu.com/v5/stock/chart/kline.json', {
      params: {
        symbol,
        begin,
        period,
        type: 'before',
        count,
        indicator,
      },
      headers: createBrowserHeaders({
        Accept: 'application/json, text/plain, */*',
        Referer: `https://xueqiu.com/S/${symbol.replace(/^\./, '')}`,
        Origin: 'https://xueqiu.com',
        Cookie: getCookieHeader(),
      }),
    });

    const payload = response?.data?.data;
    return mapKlineRows(payload);
  } catch (error) {
    wrapRequestError('xueqiu', error, 'Failed to fetch xueqiu kline');
  }
}
