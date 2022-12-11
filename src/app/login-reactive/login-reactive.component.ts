import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { createPasswordStrengthValidator } from "../validadors/password-strength.validator";

@Component({
  selector: "login",
  templateUrl: "./login-reactive.component.html",
  styleUrls: ["./login-reactive.component.css"],
})
export class LoginReactiveComponent implements OnInit {
  email = new FormControl("", {
    validators: [Validators.required, Validators.email],
    updateOn: "blur",
  });

  password = new FormControl("", {
    validators: [
      Validators.required,
      Validators.minLength(3),
      createPasswordStrengthValidator(),
    ],
  });

  form: FormGroup = new FormGroup({
    email: this.email,
    password: this.password,
  });

  constructor() {}

  ngOnInit() {}
}
