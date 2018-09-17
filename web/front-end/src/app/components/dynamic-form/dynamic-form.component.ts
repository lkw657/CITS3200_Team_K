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
  role: String;
  form: FormGroup;
  payload = '';

  constructor(private qcs: QuestionControlService) { }

  ngOnInit() {
    this.form = this.qcs.toFormGroup(this.questions);
  }

  selectRole(role, display) {
    this.form.value.submitter = role;
    this.role = display;
  }

  selectSchool(school, display) {
    this.form.value.school = school;
    this.school = display;
  }

  changeRole() {
    if (this.form.value.submitter == "researcher") {
      this.form.value.submitter = "headOfSchool";
      this.role = "Head of School";
    }
    else {
      this.form.value.submitter = "researcher";
      this.role = "Researcher";
    }
  }

  changeSchool() {
    this.form.value.school=undefined;
    this.form.value.submitter=undefined;
  }

  onSubmit() {
    this.payload = JSON.stringify(this.form.value);
  }


}
