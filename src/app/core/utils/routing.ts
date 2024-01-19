import { Router } from '@angular/router';

export const getBaseUrl = (router: Router) => {
  // exclude fragments and query parameters
  const urlTree = router.parseUrl(router.url);
  urlTree.queryParams = {};
  urlTree.fragment = null;
  return urlTree.toString();
};

export const urlJoin = (...args: unknown[]) => {
  /*
    Concats an array of strings into url format i.e. /hello/world/some/url.
    If string containing http is provided, need to provide the base DNS i.e. http://server.com
  */
  let joinedUrl = '';
  for (const arg of args) {
    let subUrl = String(arg).trim();
    subUrl = subUrl.replace(/^\//, '').replace(/\/$/, '');
    joinedUrl += `/${subUrl}`;
  }
  if (joinedUrl.includes('http')) {
    joinedUrl = joinedUrl.replace(/^\//, '');
  }
  return joinedUrl;
};
