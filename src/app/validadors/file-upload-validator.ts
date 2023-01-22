import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function fileUploadValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value;

    if (!value) return null;

    let error = false;
    if (
      value.match("jpg") === null &&
      value.match("png") === null &&
      value.match("jpeg") === null
    ) {
      error = true;
    } else {
      error = false;
    }
    return error ? { fileType: true } : null;
  };
}
