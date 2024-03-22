import { Router } from '@angular/router';
import moment from 'moment';

export function separateStringByDelimiter(input: string, delimiter: RegExp) {
  let result = input.split(delimiter);
  result = result.map(v => v.trim()).filter(v => v);
  return result;
}

export function separateCamelCase(input: string, delimiter: string) {
  let result = '';
  const regex = /[A-Z]/;
  for (const s of input) {
    if (s.match(regex)) {
      result += `${delimiter}${s.toLowerCase()}`;
    } else {
      result += s;
    }
  }
  return result;
}

export function generateHtmlId(...inputs: unknown[]) {
  const foo: string[] = [];
  inputs.forEach(v => {
    foo.push(separateCamelCase(String(v), '-'));
  });
  return foo.join('-');
}

export function formatDate(v: Date) {
  return moment(v).format('YYYY-MM-DD HH:MM:SS');
}

export function chunk(array: unknown[], size: number) {
  const chunked = [];
  for (let i = 0; i < array.length; i = i + size) {
    chunked.push(array.slice(i, i + size));
  }
  return chunked;
}

export function capitalizeFirstLetter(v: string) {
  return v.charAt(0).toUpperCase() + v.slice(1);
}

export function formatToCurrency(v: number) {
  return (Math.round(v * 100) / 100).toFixed(2);
}

export function trimTextWithEllipsis(text: string, charCount: number) {
  if (text.length <= charCount) return text;
  return text.substring(0, charCount - 2) + '...';
}

export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomNumber(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function stringToCamelCase(v: string) {
  let result: string = '';
  let isCapitalized = false;
  const regex = /[- ._]/;
  for (const s of v) {
    if (!s.match(regex)) {
      result += isCapitalized ? s.toUpperCase() : s.toLowerCase();
      isCapitalized = false;
    } else {
      isCapitalized = true;
    }
  }
  return result;
}

export function changeFactoryInUrl(router: Router, factory: string) {
  const targets = router.routerState.snapshot.url.split('/');
  // Remove existing query params if any.
  const lastTarget = targets[targets.length - 1];
  targets.splice(targets.length - 1, 1, lastTarget.split('?')[0]);
  targets.splice(0, 2, factory);
  return targets;
}
