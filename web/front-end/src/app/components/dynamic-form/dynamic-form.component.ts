import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { QuestionControlService } from '../../services/question-control.service';
import { QuestionBase } from '../../classes/question-base';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css'],
  providers: [QuestionControlService]
})
export class DynamicFormComponent implements OnInit {

  @Input()
  questions: QuestionBase<any>[] = [];
  school: String;
  submitter: String;
  school_display: String;
  submitter_display: String;
  form: FormGroup;
  payload = '';

  constructor(
    private qcs: QuestionControlService
  ) { }

  ngOnInit() {
    this.form = this.qcs.toFormGroup(this.questions);
  }

  // Saves role into form and changes view
  selectRole(role, display) {
    this.submitter = role;
    this.submitter_display = display;
  }

  // Saves school into form and changes view
  selectSchool(school, display) {
    this.school = school;
    this.school_display = display;
  }

  // DEVELOPMENT - THIS NEEDS TO CHANGE TO SUBMIT TO BACKEND
  onSubmit() {
    this.form.value.school = this.school;
    this.form.value.submitter = this.submitter;
    this.payload = JSON.stringify(this.form.value);
  }
}
