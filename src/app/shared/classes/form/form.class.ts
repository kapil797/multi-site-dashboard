import { ViewContainerRef } from '@angular/core';
import { FormGroup, FormControl, FormArray, AbstractControl } from '@angular/forms';
import { Observable, of, takeUntil } from 'rxjs';
import { NotificationRef, NotificationService } from '@progress/kendo-angular-notification';
import { checkCircleIcon, infoCircleIcon, xCircleIcon } from '@progress/kendo-svg-icons';
import { FileRestrictions } from '@progress/kendo-angular-upload';

import { createNotif } from '@shared/configs/notification';
import { CustomValidatorError } from '@core/utils/validators';
import { CancelSubscription } from '../cancel-subscription/cancel-subscription.class';

export interface FormField {
  label: string;
  identifier: symbol | string;
  formControlName: string;
  placeholder?: string; // should not be used, use hint instead
  hint?: string;
  errorMsg?: string;
  style?: unknown;
  defaultValue?: unknown;
  defaultItem?: unknown;

  validators?: string[][]; // [['min', '5'], ['required'], ['max', '10']]

  // dropdown
  dropdown?: unknown[];
  dropdown$?: Observable<unknown[]>;
  onChange?: (item: unknown) => void;
  onClose?: (item: unknown) => void;
  textField?: string;
  valueField?: string;
  multiple?: boolean;

  // upload
  restrictions?: FileRestrictions;

  // checkbox
  checkbox?: Checkbox[];

  // textarea
  rows?: number;

  // date
  maxDate?: Date;
}

export interface Dropdown {
  text: string;
  value: unknown;
}

export interface Checkbox {
  field: string;
  label: string;
}

export const FieldIdentifiers = {
  TEXTBOX: Symbol('TEXTBOX'),
  TEXTAREA: Symbol('TEXTAREA'),
  DROPDOWN: Symbol('DROPDOWN'),
  MULTISELECT: Symbol('MULTISELECT'),
  DATE: Symbol('DATE'),
  DATERANGE: Symbol('DATERANGE'),
  CHECKBOX: Symbol('CHECKBOX'),
  RADIO: Symbol('RADIO'),
  UPLOAD: Symbol('UPLOAD'),
  FILESELECT: Symbol('FILESELECT'),
};

export class Form extends CancelSubscription {
  public checkCircleIcon = checkCircleIcon;
  public xCircleIcon = xCircleIcon;
  public infoCircleIcon = infoCircleIcon;
  public isLoading: boolean = false;
  public isDisabled: boolean = false;
  public fieldIdentifiers = FieldIdentifiers;
  public appendTo: ViewContainerRef;
  public notifRef: NotificationRef;

  constructor(protected notificationService: NotificationService) {
    super();
  }

  public mapPrimitiveItemsForDropdown(items: string[] | number[]): Dropdown[] {
    const dropdown = items.map(v => {
      return { text: v.toString(), value: v };
    });
    return dropdown;
  }

  public defaultItem(text: string) {
    return { text, value: null };
  }

  public showErrorMsg(field: AbstractControl) {
    if (field.invalid && (field.dirty || field.touched)) {
      return false;
    }
    return true;
  }

  public getCustomErrorMsg(field: AbstractControl) {
    if (!field.errors) return null;
    const error = field.errors as CustomValidatorError;
    return error.message;
  }

  public validateFormControl(fc: AbstractControl) {
    if (fc.valid) return true;
    return false;
  }

  public updateValidationClass(fc: AbstractControl) {
    // Kendo dropdown does not attach valid class, to perform separately.
    if (fc.valid) return 'valid';
    else if (fc.invalid && (fc.dirty || fc.touched)) return 'invalid';
    return ''; // for initial loading
  }

  public markFieldsAsTouched(form: FormGroup) {
    Object.keys(form.controls).forEach(field => {
      const control = form.get(field);
      control?.markAsTouched();
      if (control instanceof FormControl) {
        // Pass.
      }
      if (control instanceof FormGroup) {
        this.markFieldsAsTouched(control);
      }
      if (control instanceof FormArray) {
        control.controls.forEach(afc => {
          if (afc instanceof FormGroup) {
            const fgroup = afc as FormGroup;
            this.markFieldsAsTouched(fgroup);
          } else if (afc instanceof FormControl) {
            afc.markAsTouched();
          }
        });
      }
    });
  }

  public onSubmit(formGroup: FormGroup) {
    this.markFieldsAsTouched(formGroup);

    // Default check.
    if (!formGroup.valid) {
      this.notifRef?.hide();
      this.notifRef = this.notificationService?.show(
        createNotif('error', 'Please populate the required fields', this.appendTo)
      );
      return;
    }

    // Additional checks before submitting the form.
    // Return false if form is invalid.
    const rv = this.preSubmitCallback(formGroup);
    if (rv) {
      this.notifRef?.hide();
      this.notifRef = this.notificationService?.show(createNotif('error', rv, this.appendTo));
      return;
    }

    // POST form request.
    this.isLoading = true;
    this.isDisabled = true;

    this.sendRequest$(formGroup)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: res => {
          this.isLoading = false;
          this.isDisabled = false;
          this.onSuccessCallback(formGroup, res);
        },
        error: (err: Error) => {
          this.isLoading = false;
          this.isDisabled = false;
          this.notifRef?.hide();
          this.notifRef = this.notificationService?.show(createNotif('error', err.message, this.appendTo));
          this.onErrorCallback(formGroup, err.message);
        },
      });
  }

  public preSubmitCallback(_formGroup: FormGroup): string | null {
    // Override for custom implementation.
    return null;
  }

  public sendRequest$(_formGroup: FormGroup): Observable<unknown> {
    // Override as necessary.
    // Omit if POSTing of form is not required.
    return of(null);
  }

  public onErrorCallback(_formGroup: FormGroup, _err: string) {
    // Additional logic to perform during error.
  }

  public onSuccessCallback(_formGroup: FormGroup, _res: unknown) {
    // Additional logic for success response.
  }

  public cloneAbstractControl(control: AbstractControl) {
    // Deep copy reactive forms.
    let newControl: AbstractControl;

    if (control instanceof FormGroup) {
      const formGroup = new FormGroup({}, control.validator, control.asyncValidator);
      const controls = control.controls;
      Object.keys(controls).forEach(key => {
        formGroup.addControl(key, this.cloneAbstractControl(controls[key]));
      });
      newControl = formGroup;
    } else if (control instanceof FormArray) {
      const formArray = new FormArray<AbstractControl>([], control.validator, control.asyncValidator);
      control.controls.forEach((nestedControl: AbstractControl) => {
        formArray.push(this.cloneAbstractControl(nestedControl));
      });
      newControl = formArray;
    } else if (control instanceof FormControl) {
      newControl = new FormControl(control.value, control.validator, control.asyncValidator);
    } else {
      throw new Error('Unexpected interface for cloning abstract control');
    }
    if (control.disabled) newControl.disable({ emitEvent: false });
    return newControl;
  }
}
