import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { CoursesService } from "../../services/courses.service";
import { courseTitleValidator } from "../../validadors/course-title.validator";
import { Observable } from "rxjs";

interface CourseCategory {
  code: string;
  description: string;
}

@Component({
  selector: "create-course-step-1",
  templateUrl: "./create-course-step-1.component.html",
  styleUrls: ["./create-course-step-1.component.scss"],
})
export class CreateCourseStep1Component implements OnInit {
  first: string = "";

  form = this.fb.group({
    title: [
      "",
      {
        validators: [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(60),
        ],
        asyncValidators: [courseTitleValidator(this.course)],
        updateOn: "blur",
      },
    ],
    releaseDateAt: [new Date(), Validators.required],
    downLoadsAllowed: [false, Validators.requiredTrue],
    longDescription: ["", [Validators.required, Validators.minLength(6)]],
    category: ["BEGINNER", Validators.required],
  });

  constructor(private fb: FormBuilder, private course: CoursesService) {}

  ngOnInit() {
    this.courseCategories$ = this.course.findCourseCategories();
  }

  //create a getter to access title property of form

  get courseTitle() {
    return this.form.controls.title;
  }

  //create a observable to call endpoint
  courseCategories$: Observable<CourseCategory[]>;
}
