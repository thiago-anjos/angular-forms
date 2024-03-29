import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { createPromoRangeValidator } from "../../validadors/data-range.validators";
import { fileUploadValidator } from "../../validadors/file-upload-validator";

@Component({
  selector: "create-course-step-2",
  templateUrl: "create-course-step-2.component.html",
  styleUrls: ["create-course-step-2.component.scss"],
})
export class CreateCourseStep2Component implements OnInit {
  form = this.fb.group(
    {
      courseType: ["premium", Validators.required],
      price: [
        null,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(9999),
          Validators.pattern("[0-9]"),
        ],
      ],
      thumbnail: [null, [Validators.required, fileUploadValidator()]],
      promoStartAt: [null, Validators.required],
      promoEndAt: [null, Validators.required],
    },
    {
      validators: [createPromoRangeValidator()],
    }
  );

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form.valueChanges.subscribe((val) => {
      const priceControl = this.form.controls.price;
      if (val.courseType === "free" && priceControl.enabled) {
        // We set emitEvent to false to avoid the priceControl to re-emit the event to itself avoiding a loop to the application
        priceControl.disable({ emitEvent: false });
        priceControl.reset();
      } else if (val.courseType == "premium" && priceControl.disabled) {
        priceControl.enable({ emitEvent: false });
      }
    });
  }
}
