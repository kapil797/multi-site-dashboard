import { FormControl } from '@angular/forms';
import { createEmailValidator, createPhoneNumberValidator } from './validators';

describe('Utils', () => {
  it('should validate email address', () => {
    let fn = createEmailValidator();
    const fc = new FormControl();
    let input: string | number = 'daronphang@micron.com';

    fc.setValue(input);
    expect(fn(fc)).toBeNull();

    input = 'daronphang@micron.com \n daronphang@micron.com';
    fc.setValue(input);
    expect(fn(fc)).toEqual({ message: `Remove duplicate email address` });

    input = 123;
    fc.setValue(input);
    expect(fn(fc)).toEqual({ message: 'invalid input, must be of type string or array' });

    input = 'daronphang@micron.com \n daronphang1@micron.com';
    fc.setValue(input);
    expect(fn(fc)).toBe(null);

    input = 'daronphang@micron.com \n daronphang1@micron.com \n daron@gmail';
    fc.setValue(input);
    expect(fn(fc)).toEqual({ message: 'Invalid email address: daron@gmail' });

    fn = createEmailValidator(1);
    input = 'daronphang@micron.com \n daronphang1@micron.com';
    fc.setValue(input);
    expect(fn(fc)).toEqual({ message: 'Maximum of 1 email address is allowed' });
  });

  it('should validate phone number', () => {
    const fn = createPhoneNumberValidator('65');
    const fc = new FormControl();
    let input: string = '12345678';

    fc.setValue(input);
    expect(fn(fc)).toBeNull();

    input = '123456789';
    fc.setValue(input);
    expect(fn(fc)).toEqual({ message: 'Invalid phone number (+65): 123456789' });

    input = '123456';
    fc.setValue(input);
    expect(fn(fc)).toEqual({ message: 'Invalid phone number (+65): 123456' });

    input = '12345ab8';
    fc.setValue(input);
    expect(fn(fc)).toEqual({ message: 'Invalid phone number (+65): 12345ab8' });
  });
});
