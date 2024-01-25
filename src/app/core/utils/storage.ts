export const setSessionStorage = (key: string, data: string | object) => {
  if (typeof data !== 'object') window.sessionStorage.setItem(key, data);
  else window.sessionStorage.setItem(key, JSON.stringify(data));
};

export const getSessionStorage = (key: string) => {
  try {
    return JSON.parse(window.sessionStorage.getItem(key) as string);
  } catch {
    return window.sessionStorage.getItem(key);
  }
};

export const setLocalStorage = (key: string, data: string | object) => {
  if (typeof data !== 'object') window.localStorage.setItem(key, data);
  else window.localStorage.setItem(key, JSON.stringify(data));
};

export const getLocalStorage = (key: string) => {
  try {
    return JSON.parse(window.localStorage.getItem(key) as string);
  } catch {
    return window.localStorage.getItem(key);
  }
};
