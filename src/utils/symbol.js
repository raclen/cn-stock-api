export function tushareToSina(symbol) {
  const [code, market] = String(symbol).split('.');

  if (!code || !market) {
    throw new Error(`Invalid tushare symbol: ${symbol}`);
  }

  return `${market.toLowerCase()}${code}`;
}

export function normalizeSinaSymbol(symbol) {
  const value = String(symbol).trim();

  if (/^(sh|sz|hk|us)/i.test(value)) {
    return value.toLowerCase();
  }

  throw new Error(`Unsupported sina symbol: ${symbol}`);
}

export function normalizeSymbols(symbols) {
  if (Array.isArray(symbols)) {
    return symbols.map((item) => String(item).trim()).filter(Boolean);
  }

  return [String(symbols).trim()].filter(Boolean);
}
