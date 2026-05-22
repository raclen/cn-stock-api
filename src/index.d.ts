export interface QuoteBar {
  date?: string;
  open?: number;
  close?: number;
  high?: number;
  low?: number;
  volume?: number;
  amount?: number;
  amplitude?: number;
  changePct?: number;
  changeAmount?: number;
  turnoverRate?: number;
}

export interface RealtimeQuote {
  symbol: string;
  name?: string;
  open?: number;
  previousClose?: number;
  price?: number;
  high?: number;
  low?: number;
  bid?: number;
  ask?: number;
  volume?: number;
  amount?: number;
  date?: string;
  time?: string;
}

export interface EastmoneyKlineOptions {
  symbol: string;
  market: string | number;
  beg?: string;
  end?: string;
  klt?: number;
  fqt?: number;
  limit?: number;
}

export interface SinaKlineOptions {
  symbol: string;
  scale?: number;
  datalen?: number;
  ma?: string;
}

export interface XueqiuAuthOptions {
  xqat?: string;
  u?: string;
  cookie?: string;
}

export interface XueqiuKlineOptions {
  symbol: string;
  begin?: number;
  period?: string;
  count?: number;
  indicator?: string;
}

export declare class FinanceError extends Error {
  source?: string;
  code?: string;
  status?: number;
  cause?: unknown;
  constructor(message: string, options?: { source?: string; code?: string; status?: number; cause?: unknown });
}

export const eastmoney: {
  getKline(options: EastmoneyKlineOptions): Promise<QuoteBar[]>;
};

export const sina: {
  getRealtime(symbols: string | string[]): Promise<RealtimeQuote | RealtimeQuote[]>;
  getKline(options: SinaKlineOptions): Promise<QuoteBar[]>;
};

export const xueqiu: {
  setAuth(options: XueqiuAuthOptions): void;
  getKline(options: XueqiuKlineOptions): Promise<QuoteBar[]>;
};

export function getEastmoneyKline(options: EastmoneyKlineOptions): Promise<QuoteBar[]>;
export function getSinaRealtime(symbols: string | string[]): Promise<RealtimeQuote | RealtimeQuote[]>;
export function getSinaKline(options: SinaKlineOptions): Promise<QuoteBar[]>;
export function setXueqiuAuth(options: XueqiuAuthOptions): void;
export function getXueqiuKline(options: XueqiuKlineOptions): Promise<QuoteBar[]>;
export function tushareToSina(symbol: string): string;
export function normalizeSinaSymbol(symbol: string): string;
export function normalizeSymbols(symbols: string | string[]): string[];
