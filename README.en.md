# cn-stock-api

A lightweight Node.js package that wraps three commonly used market data sources: Eastmoney, Sina, and Xueqiu.

## Features

- Historical K-line data from Eastmoney
- Realtime quotes and historical K-line data from Sina
- Historical K-line data from Xueqiu
- Unified output fields for charting, backtesting, and exporting
- Pure ESM with no build step
- Bundled TypeScript declarations

## Install

```bash
npm install cn-stock-api
```

## Quick start

```js
import { eastmoney, sina, xueqiu } from 'cn-stock-api';

const bars = await eastmoney.getKline({
  symbol: 'NDX100',
  market: 100,
  beg: '20240101',
  end: '20240522',
});

const quote = await sina.getRealtime('sh600519');

xueqiu.setAuth({
  xqat: process.env.XUEQIU_XQAT,
  u: process.env.XUEQIU_U,
});

const xqBars = await xueqiu.getKline({
  symbol: '.IXIC',
  begin: Date.now(),
  period: 'day',
  count: -30,
});
```

## APIs

### eastmoney.getKline(options)

- `symbol`: instrument code such as `159509` or `NDX100`
- `market`: market prefix such as `0`, `1`, or `100`
- `beg`: start date in `YYYYMMDD`
- `end`: end date in `YYYYMMDD`
- `klt`: K-line period, default `101`
- `fqt`: adjustment flag, default `1`
- `limit`: max rows, default `1000000`

### sina.getRealtime(symbols)

- `symbols`: one symbol or an array such as `sh600519` or `['sh600519', 'sz000001']`

### sina.getKline(options)

- `symbol`: Sina symbol such as `sh000001`
- `scale`: interval, default `240`
- `datalen`: row count, default `120`
- `ma`: moving average flag, default `no`

### xueqiu.setAuth(options)

Set auth before requesting Xueqiu:

```js
xueqiu.setAuth({ xqat: 'xxx', u: 'xxx' });
```

You can also pass a full cookie string:

```js
xueqiu.setAuth({ cookie: 'xqat=xxx;u=xxx' });
```

### xueqiu.getKline(options)

- `symbol`: code such as `.IXIC`
- `begin`: timestamp in milliseconds, defaults to now
- `period`: interval, default `day`
- `count`: row count, default `-120`
- `indicator`: raw indicator list sent to Xueqiu

## Utility

```js
import { tushareToSina } from 'cn-stock-api';

tushareToSina('600519.SH'); // sh600519
```

## Notes

- Sina responses are GBK encoded and are decoded automatically.
- Xueqiu requires valid cookie data; store it in env vars or your own config.
- Public market data endpoints may change fields or anti-bot rules, so callers should handle retries and monitoring.

## Development

```bash
npm install
npm test
```

## License

MIT
