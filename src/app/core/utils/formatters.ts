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
