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

  @Input() questions: QuestionBase<any>[] = [];
  school: String;
  submitter: String;
  form: FormGroup;
  payload = '';

  constructor(private qcs: QuestionControlService) { }

  //What should be displayed
  displayQuestions: boolean = false;
  displayRole: boolean = false;
  displaySchool: boolean = true;

  ngOnInit() {
    this.form = this.qcs.toFormGroup(this.questions);
  }

  selectRole(role, display) {
    this.form.value.submitter = role;
    this.submitter = display;

    this.displayRole = false;
    this.displayQuestions = true;
  }

  selectSchool(school, display) {
    this.form.value.school = school;
    this.school = display;
    this.displaySchool = false;
    if (this.form.value.submitter) {
      this.displayRole = false;
    }
    else {
      this.displayRole = true;
    }
  }

  changeRole() {
    if (this.form.value.submitter == "researcher") {
      this.form.value.submitter = "headOfSchool";
      this.submitter = "Head of School";
    }
    else {
      this.form.value.submitter = "researcher";
      this.submitter = "Researcher";
    }
  }

  changeSchool() {
    this.displayQuestions = false;
    this.displayRole = false;
    this.displaySchool = true;
  }

  onSubmit() {
    this.payload = JSON.stringify(this.form.value);
  }
}
