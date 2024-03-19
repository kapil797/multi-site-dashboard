import { AbstractControl, FormArray, ValidationErrors, ValidatorFn } from '@angular/forms';
import { separateStringByDelimiter } from './formatters';

/*
- Validator functions accept one input of type AbstractControl
- Returns null if no errors are found
- Returns an object of type ValidationErrors if errors are found i.e. {someProperty: 'hello world error'}
- If want to indicate an error without providing any details, return {someProperty: true}
*/

export interface CustomValidatorError {
  message: string;
}

export interface RegEx {
  [key: string]: RegExp;
}

function validateInput(
  regex: RegExp,
  identifier: string,
  control: AbstractControl,
  maxCount?: number
): ValidationErrors | null {
  /*
  Default settings:
  - delimiter is a new line
  - duplicates are not allowed
  - if number of valid matches do not match original count of input, it will be considered invalid
  */
  if (!control.value) {
    return { message: `Provide a ${identifier}` };
  }

  let values: string[];
  if (typeof control.value === 'string') values = separateStringByDelimiter(control.value, /\n/);
  else if (Array.isArray(control.value)) values = control.value;
  else return { message: 'invalid input, must be of type string or array' };

  // check duplicate values
  if (values.length > new Set(values).size) {
    return { message: `Remove duplicate ${identifier}` };
  } else if (maxCount && values.length > maxCount) {
    return { message: `Maximum of ${maxCount} ${identifier} is allowed` };
  }

  const invalid: string[] = [];
  values.forEach(v => {
    if (!v.match(regex)) {
      invalid.push(v);
    }
  });
  if (invalid.length > 0) {
    return {
      message: `Invalid ${identifier}: ${invalid.join(', ')}`,
    };
  }
  return null;
}

export function createEmailValidator(maxCount?: number): ValidatorFn {
  const regex =
    /([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|"(!#-[^-~ \t]|(\\[\t -~]))+")@[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?(\.[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?)+/;

  return (control: AbstractControl): ValidationErrors | null => {
    return validateInput(regex, 'email address', control, maxCount);
  };
}

export function createUuidValidator(maxCount?: number): ValidatorFn {
  const regex = /^[a-zA-Z0-9-]{36}$/;

  return (control: AbstractControl): ValidationErrors | null => {
    return validateInput(regex, 'unique id', control, maxCount);
  };
}

export function createPriceValidator(maxCount?: number, isRequired?: boolean): ValidatorFn {
  const regex = /^[0-9]{1,}\.[0-9]{2}$/;

  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value && !isRequired) return null;
    return validateInput(regex, 'price', control, maxCount);
  };
}

export function createCheckboxValidator(minRequired: number, identifier: string): ValidatorFn {
  // Each checkbox must be a FormControl within FormArray
  // when checked, it should push a formControl into the FormArray
  return (control: AbstractControl): ValidationErrors | null => {
    let checked = 0;
    const formArray = control as FormArray;
    formArray.controls.forEach(() => {
      checked++;
    });
    if (checked < minRequired) {
      return { message: `Select a minimum of ${minRequired} ${identifier}s` };
    }
    return null;
  };
}

export function createBOMValidator(maxCount?: number): ValidatorFn {
  const regex = /^[0-9]{2}[A-Z0-9]{1,}-[0-5]{1}[0-9]{3}-[A-Z0-9-]{1,}$/;

  return (control: AbstractControl): ValidationErrors | null => {
    return validateInput(regex, 'BOM', control, maxCount);
  };
}

export function createFileSelectValidator(maxCount?: number): ValidatorFn {
  // if field is required, use built-in restrictions for kendo file select
  // i.e. restrictions: { allowedExtensions: ['jpg', 'jpeg', 'png'] }
  return (control: AbstractControl): ValidationErrors | null => {
    const files = control.value as File[];
    if (!control.value || files.length === 0) return null;
    const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
    for (const file of files) {
      if (!allowedExtensions.exec(file.name)) return { message: `Invalid file type: ${file.name}` };
    }
    if (maxCount && files.length > maxCount) return { message: `Maximum upload of ${maxCount} files are allowed` };
    return null;
  };
}

export function createPhoneNumberValidator(countryCode: string): ValidatorFn {
  const regex: RegEx = {
    '65': /^[0-9]{8}$/,
  };

  return (control: AbstractControl): ValidationErrors | null => {
    return validateInput(regex[countryCode], `phone number (+${countryCode})`, control, 1);
  };
}

export function createPostalCodeValidator(countryCode: string): ValidatorFn {
  const regex: RegEx = {
    '65': /^[0-9]{6}$/,
  };

  return (control: AbstractControl): ValidationErrors | null => {
    return validateInput(regex[countryCode], `postal code (+${countryCode})`, control, 1);
  };
}
