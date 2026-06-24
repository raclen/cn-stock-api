const DEFAULT_TIMEOUT = 15000;

class HttpError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = 'HttpError';
    this.code = options.code;
    this.status = options.status;
    this.response = options.response;
    this.cause = options.cause;
  }
}

function appendParams(url, params = {}) {
  const target = new URL(url);

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) {
      continue;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        target.searchParams.append(key, item);
      }
      continue;
    }

    target.searchParams.set(key, value);
  }

  return target.toString();
}

async function parseBody(response, responseType) {
  if (responseType === 'arraybuffer') {
    return response.arrayBuffer();
  }

  if (responseType === 'text') {
    return response.text();
  }

  const text = await response.text();

  if (!text) {
    return undefined;
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    throw new HttpError('Failed to parse JSON response', {
      code: 'ERR_BAD_RESPONSE',
      status: response.status,
      response: {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: text,
      },
      cause: error,
    });
  }
}

async function request(method, url, config = {}) {
  if (typeof fetch !== 'function') {
    throw new HttpError('Global fetch is not available in this runtime', {
      code: 'ERR_FETCH_UNAVAILABLE',
    });
  }

  const {
    params,
    headers,
    timeout = DEFAULT_TIMEOUT,
    responseType = 'json',
    signal,
    ...fetchOptions
  } = config;

  const controller = new AbortController();
  const timeoutId = timeout > 0
    ? setTimeout(() => controller.abort(new Error(`Request timed out after ${timeout}ms`)), timeout)
    : undefined;

  if (signal) {
    if (signal.aborted) {
      controller.abort(signal.reason);
    } else {
      signal.addEventListener('abort', () => controller.abort(signal.reason), { once: true });
    }
  }

  try {
    const response = await fetch(appendParams(url, params), {
      ...fetchOptions,
      method,
      headers,
      signal: controller.signal,
    });
    const data = await parseBody(response, responseType);
    const result = {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      config,
    };

    if (!response.ok) {
      throw new HttpError(`Request failed with status code ${response.status}`, {
        code: 'ERR_BAD_RESPONSE',
        status: response.status,
        response: result,
      });
    }

    return result;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }

    const isAbort = error?.name === 'AbortError' || controller.signal.aborted;
    throw new HttpError(error?.message || 'Network request failed', {
      code: isAbort ? 'ECONNABORTED' : 'ERR_NETWORK',
      cause: error,
    });
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

export const http = {
  get(url, config = {}) {
    return request('GET', url, config);
  },
};

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
  });

  return response.data;
}
