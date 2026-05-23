# cn-stock-api

[![npm version](https://img.shields.io/npm/v/cn-stock-api.svg)](https://www.npmjs.com/package/cn-stock-api)
[![npm downloads](https://img.shields.io/npm/dm/cn-stock-api.svg)](https://www.npmjs.com/package/cn-stock-api)
[![license](https://img.shields.io/npm/l/cn-stock-api.svg)](https://www.npmjs.com/package/cn-stock-api)

一个面向 Node.js 的轻量 npm 包，统一封装东方财富、新浪、雪球三个常用行情数据源。

## 特性

- 支持东方财富历史 K 线
- 支持新浪实时行情与历史 K 线
- 支持雪球历史 K 线
- 统一返回字段，方便后续画图、回测、导出
- 纯 ESM，零构建步骤
- 附带 TypeScript 类型声明

## 安装

```bash
npm install cn-stock-api
```

npm 页面：https://www.npmjs.com/package/cn-stock-api
仓库地址：https://github.com/raclen/cn-stock-api

## 快速开始

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

## API

### eastmoney.getKline(options)

参数：

- `symbol`: 标的代码，例如 `159509`、`NDX100`
- `market`: 市场前缀，例如 A 股常见 `0` / `1`，美股指数常见 `100`
- `beg`: 开始日期，格式 `YYYYMMDD`
- `end`: 结束日期，格式 `YYYYMMDD`
- `klt`: K 线类型，默认 `101`（日线）
- `fqt`: 复权类型，默认 `1`
- `limit`: 最大返回条数，默认 `1000000`

返回示例：

```js
[
  {
    date: '2026-05-22',
    open: 100,
    close: 101,
    high: 103,
    low: 99,
    volume: 123456,
    amount: 987654,
    amplitude: 4.2,
    changePct: 1.1,
    changeAmount: 1.1,
    turnoverRate: 0.8,
  },
]
```

### sina.getRealtime(symbols)

参数：

- `symbols`: 单个代码或数组，例如 `sh600519`、`['sh600519', 'sz000001']`

返回单个对象或对象数组。

### sina.getKline(options)

参数：

- `symbol`: 新浪格式代码，例如 `sh000001`
- `scale`: 周期，默认 `240`
- `datalen`: 返回条数，默认 `120`
- `ma`: 是否返回均线，默认 `no`

### xueqiu.setAuth(options)

调用雪球前先注入认证信息：

```js
xueqiu.setAuth({ xqat: 'xxx', u: 'xxx' });
```

也支持直接传完整 cookie：

```js
xueqiu.setAuth({ cookie: 'xqat=xxx;u=xxx' });
```

### xueqiu.getKline(options)

参数：

- `symbol`: 代码，例如 `.IXIC`
- `begin`: 毫秒时间戳，默认当前时间
- `period`: 周期，默认 `day`
- `count`: 返回条数，默认 `-120`
- `indicator`: 指标字段，默认与雪球网页请求一致

## 工具函数

```js
import { FinanceError, tushareToSina } from 'cn-stock-api';

tushareToSina('600519.SH'); // sh600519
```

## 错误处理

```js
import { FinanceError, sina } from 'cn-stock-api';

try {
  await sina.getRealtime('sh600519');
} catch (error) {
  if (error instanceof FinanceError) {
    console.error(error.source, error.status, error.message);
  }
}
```

## 示例

```bash
node examples/basic.js
```

## 注意事项

- 新浪接口返回 GBK 编码，包内已自动解码。
- 雪球接口依赖 cookie，建议你自己抓包后放到环境变量或配置文件里。
- 公共行情接口可能调整字段或风控策略，建议业务侧做好失败重试与监控。

## 开发

```bash
npm install
npm test
```

## License

MIT
