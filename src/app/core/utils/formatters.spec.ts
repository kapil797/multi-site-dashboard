import {
  capitalizeFirstLetter,
  chunk,
  formatToCurrency,
  separateCamelCase,
  separateStringByDelimiter,
  trimTextWithEllipsis,
} from '@core/utils/formatters';
import { urlJoin } from './routing';

describe('Utils', () => {
  it('should separate string by delimiter', () => {
    let input = 'hello world, 123   ,  you are great!  ';
    expect(separateStringByDelimiter(input, /,/)).toEqual(['hello world', '123', 'you are great!']);

    input = 'hello world \n 123   , \n  you are great! \n  ';
    expect(separateStringByDelimiter(input, /\n/)).toEqual(['hello world', '123   ,', 'you are great!']);

    input = '4110-53 PERIPH OXIDE RTP\n6550-53 PERIPH POLY RTP\n';
    expect(separateStringByDelimiter(input, /\n/)).toEqual(['4110-53 PERIPH OXIDE RTP', '6550-53 PERIPH POLY RTP']);

    input = 'hello DEL world DEL ! awesome ! ';
    expect(separateStringByDelimiter(input, /DEL/)).toEqual(['hello', 'world', '! awesome !']);
  });

  it('should separate camel case with delimiter', () => {
    let input = 'helloWorldMyFriend';
    expect(separateCamelCase(input, ' ')).toEqual('hello world my friend');

    input = 'helloWorldOHMYTIAN';
    expect(separateCamelCase(input, ' ')).toEqual('hello world o h m y t i a n');

    input = 'helloWorld123World';
    expect(separateCamelCase(input, ' ')).toEqual('hello world123 world');
  });

  it('should split an array by chunks', () => {
    const arr: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    expect(chunk(arr, 5)).toEqual([
      [1, 2, 3, 4, 5],
      [6, 7, 8, 9, 10],
      [11, 12, 13, 14, 15],
    ]);
    expect(chunk(arr, 7)).toEqual([[1, 2, 3, 4, 5, 6, 7], [8, 9, 10, 11, 12, 13, 14], [15]]);
    expect(chunk(arr, 2)).toEqual([[1, 2], [3, 4], [5, 6], [7, 8], [9, 10], [11, 12], [13, 14], [15]]);
  });

  it('should capitalize first letter', () => {
    expect(capitalizeFirstLetter('helloWorld')).toEqual('HelloWorld');
    expect(capitalizeFirstLetter('HelloWorld')).toEqual('HelloWorld');
    expect(capitalizeFirstLetter('1helloWorld')).toEqual('1helloWorld');
  });

  it('should format value to currency', () => {
    expect(formatToCurrency(12)).toEqual('12.00');
    expect(formatToCurrency(0.05)).toEqual('0.05');
    expect(formatToCurrency(12.256)).toEqual('12.26');
    expect(formatToCurrency(5.1)).toEqual('5.10');
  });

  it('should trim text with ellipsis', () => {
    expect(trimTextWithEllipsis('hello world', 11)).toEqual('hello world');
    expect(trimTextWithEllipsis('hello world', 10)).toEqual('hello wo...');
    expect(trimTextWithEllipsis('hello world', 1)).toEqual('...');
  });

  it('should join urls', () => {
    expect(urlJoin('hello', 'world', 123, 'product')).toEqual('/hello/world/123/product');
    expect(urlJoin('http://example.com', 'hello', 'world', 123)).toEqual('http://example.com/hello/world/123');
    expect(urlJoin('hello', 'world', '#', 123)).toEqual('/hello/world/#/123');
  });
});
