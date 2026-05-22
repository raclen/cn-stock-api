import { createBrowserHeaders, decodeGbk, getArrayBuffer, getText } from '../utils/request.js';
import { wrapRequestError } from '../utils/error.js';
import { normalizeSinaSymbol, normalizeSymbols } from '../utils/symbol.js';

function toNumber(value) {
  if (value === undefined || value === null || value === '' || value === '-') {
    return undefined;
  }

  const number = Number(value);
  return Number.isNaN(number) ? undefined : number;
}

export function parseSinaRealtimeText(text) {
  const rows = [];
  const pattern = /var\s+hq_str_([^=]+)="([^"]*)";/g;

  let match;
  while ((match = pattern.exec(text)) !== null) {
    const symbol = match[1];
    const fields = match[2].split(',');

    rows.push({
      symbol,
      name: fields[0] || undefined,
      open: toNumber(fields[1]),
      previousClose: toNumber(fields[2]),
      price: toNumber(fields[3]),
      high: toNumber(fields[4]),
      low: toNumber(fields[5]),
      bid: toNumber(fields[6]),
      ask: toNumber(fields[7]),
      volume: toNumber(fields[8]),
      amount: toNumber(fields[9]),
      date: fields[30] || undefined,
      time: fields[31] || undefined,
    });
  }

  return rows;
}

export function parseSinaKlineResponse(text) {
  const start = text.indexOf('=(');
  const end = text.lastIndexOf(')');

  if (start === -1 || end === -1 || end <= start + 2) {
    throw new Error('Invalid sina JSONP payload');
  }

  const payload = text.slice(start + 2, end);
  const items = JSON.parse(payload);

  return items.map((item) => ({
    date: item.day || item.date,
    open: toNumber(item.open),
    close: toNumber(item.close),
    high: toNumber(item.high),
    low: toNumber(item.low),
    volume: toNumber(item.volume),
    amount: toNumber(item.amount),
  }));
}

export async function getRealtime(symbols) {
  const normalized = normalizeSymbols(symbols).map(normalizeSinaSymbol);

  if (normalized.length === 0) {
    throw new Error('sina.getRealtime requires at least one symbol');
  }

  try {
    const buffer = await getArrayBuffer('https://hq.sinajs.cn', {
      params: {
        list: normalized.join(','),
      },
      headers: createBrowserHeaders({
        Referer: 'https://finance.sina.com.cn/',
        'Sec-Fetch-Site': 'cross-site',
        'Sec-Fetch-Mode': 'no-cors',
        'Sec-Fetch-Dest': 'script',
      }),
    });

    const text = decodeGbk(buffer);
    const rows = parseSinaRealtimeText(text);

    if (normalized.length === 1) {
      return rows[0];
    }

    return rows;
  } catch (error) {
    wrapRequestError('sina', error, 'Failed to fetch sina realtime quote');
  }
}

export async function getKline({ symbol, scale = 240, datalen = 120, ma = 'no' }) {
  const normalized = normalizeSinaSymbol(symbol);
  const url = `https://quotes.sina.cn/cn/api/jsonp_v2.php/var%20_${normalized}_${scale}_${Date.now()}=/CN_MarketDataService.getKLineData`;

  try {
    const text = await getText(url, {
      params: {
        symbol: normalized,
        scale,
        ma,
        datalen,
      },
      headers: createBrowserHeaders({
        Referer: `https://finance.sina.com.cn/realstock/company/${normalized}/nc.shtml`,
      }),
    });

    return parseSinaKlineResponse(text);
  } catch (error) {
    wrapRequestError('sina', error, 'Failed to fetch sina kline');
  }
}
