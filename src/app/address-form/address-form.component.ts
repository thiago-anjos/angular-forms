import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR,
  Validators,
} from "@angular/forms";
import { Subscription } from "rxjs";

@Component({
  selector: "app-address-form",
  templateUrl: "./address-form.component.html",
  styleUrls: ["./address-form.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: AddressFormComponent,
    },
  ],
})

// Com a implementação da interface ControlValuAccessor, criamos uma ponte entre esse subformulário com qualquer formulario pai
// ou seja, esse pequeno form, pode ser colocado abaixo de qualquer formulário angular, se tornando reutilizável.
// igual fizemos com o componente fileUpload
export class AddressFormComponent implements ControlValueAccessor, OnDestroy {
  @Input()
  legend: string;

  form: FormGroup = this.fb.group({
    addressLine1: [null, [Validators.required]],
    addressLine2: [null, [Validators.required]],
    zipCode: [null, [Validators.required]],
    city: [null, [Validators.required]],
  });

  _onTouched = () => {};

  _onChangeSub: Subscription;

  constructor(private fb: FormBuilder) {}

  writeValue(value: any): void {
    if (value) {
      this.form.setValue(value);
    }
  }

  registerOnTouched(onTouched: any): void {
    this._onTouched = onTouched;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  registerOnChange(onChange: any): void {
    this._onChangeSub = this.form.valueChanges.subscribe(onChange);
  }

  ngOnDestroy() {
    this._onChangeSub.unsubscribe();
  }
}
