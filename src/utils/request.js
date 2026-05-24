import axios from 'axios';

const DEFAULT_TIMEOUT = 15000;

export const http = axios.create({
  timeout: DEFAULT_TIMEOUT,
  responseType: 'json',
});

var UA = [
    "Mozilla/5.0 (iPhone; CPU iPhone OS 5_0 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A334 Safari/7534.48.3",
    "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)",
    "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_6; en-US) AppleWebKit/533.20.25 (KHTML, like Gecko) Version/5.0.4 Safari/533.20.27",
    "Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.94 Safari/537.36",
    "Mozilla/5.0 (Windows NT 6.2; WOW64; rv:21.0) Gecko/20100101 Firefox/21.0",
    "Mozilla/5.0 (Linux; U; Android 4.0.4; en-gb; GT-I9300 Build/IMM76D) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30"
];
function randomUA(){
    var n=Math.floor(Math.random()*UA.length+1)-1;
    return UA[n]
}

const browserHeaders = {
  'User-Agent': randomUA(),
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
