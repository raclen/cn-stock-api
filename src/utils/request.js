import axios from 'axios';

const DEFAULT_TIMEOUT = 15000;

export const http = axios.create({
  timeout: DEFAULT_TIMEOUT,
  responseType: 'json',
});

const browserHeaders = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
  'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
};

export function createBrowserHeaders(overrides = {}) {
  return {
    ...browserHeaders,
    ...overrides,
  };
}

export function decodeGbk(buffer) {
  return new TextDecoder('gbk').decode(buffer);
}

export async function getArrayBuffer(url, config = {}) {
  const response = await http.get(url, {
    ...config,
    responseType: 'arraybuffer',
  });

  return response.data;
}

export async function getText(url, config = {}) {
  const response = await http.get(url, {
    ...config,
    responseType: 'text',
    transformResponse: [(value) => value],
  });

  return response.data;
}
