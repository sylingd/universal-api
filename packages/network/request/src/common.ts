import { DATA_TYPE, AsObject, RequestOptions } from './types';
// import { promisify } from '../../../utils/promisify';

export function getDataWithType(data: any, type: DATA_TYPE) {
  if (type === DATA_TYPE.json) {
    try {
      return JSON.parse(data);
    } catch (e) { }
  }

  if (type === DATA_TYPE.text) {
    try {
      return JSON.stringify(data);
    } catch (e) { }
  }

  return data;
}

export function stringifyQS(qs: AsObject): string {
  if (!qs) {
    return '';
  }
  const str: string[] = [];
  for (const key in qs) {
    if (!!qs[key]) {
      str.push(`${key}=${encodeURIComponent(String(qs[key]))}`);
    }
  }
  return str.join('&');
}

export function applyParamToURL(param: AsObject | void, url: string): string {
  if (!param) {
    return url;
  }
  return `${url}${url.indexOf('?') === -1 ? '?' : '&'}${stringifyQS(param)}`;
}

export function object2json(obj: any) {
  try {
    return JSON.stringify(obj);
  } catch (e) {
    return obj || '';
  }
}

export function isObject(obj: any) {
  return typeof obj === 'object' && obj !== null;
}

export function normalizeHeaders(obj: AsObject) {
  if (!isObject(obj)) {
    return obj;
  }
  const keyList = ['Accept', 'Content-Type'];

  keyList.forEach(key => {
    Object.keys(obj).some((headerKey: string) => {
      if (headerKey.toUpperCase() === key.toUpperCase()
          && headerKey !== key
      ) {
        obj[key] = obj[headerKey];
        delete obj[headerKey];
        return true;
      }
      return false;
    });
  });
  return obj;
}

export function checkIsApplyDataToURL(headers: AsObject | undefined) {
  if (!headers || !headers['Content-Type']) {
    return false;
  }
  return String(headers['Content-Type']).toLowerCase().indexOf('application/x-www-form-urlencoded') > -1;
}

const EMPTY_OBJECT = {};

export function isPlainObject(obj) {
  return EMPTY_OBJECT.toString.call(obj) === '[object Object]';
}
export function styleOptions(options) {
  const DEFAULT_TIMEOUT = 20000;
  enum DATA_TYPE {
    json = 'json',
    text = 'text'
  }
  const DEFAULT_REQUEST_OPTIONS: RequestOptions = {
    url: '',
    headers: { 'Content-Type': 'application/json' },
    method: 'GET',
    timeout: DEFAULT_TIMEOUT,
    dataType: DATA_TYPE.json
  };
  let afterOptions: RequestOptions = Object.assign({},
    DEFAULT_REQUEST_OPTIONS,
    options,
    {
      method: (options.method || 'GET').toUpperCase(),
      headers: normalizeHeaders(options.headers || {})
    });
  return afterOptions;
}
export function initApi(api) {
  return (options) => {
    const afterOptions = styleOptions(options);
    return api(afterOptions);
  };
}