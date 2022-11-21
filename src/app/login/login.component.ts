import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";

@Component({
  selector: "login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  public login(loginForm: NgForm, submitEvent) {
    console.log("ngFomr", loginForm);
    console.log("$event form", submitEvent);
  }

  public emailChange(event) {
    console.log("email change event", event);
  }
}
