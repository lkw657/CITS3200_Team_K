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
  display: String;
  form: FormGroup;
  payload = '';

  constructor(private qcs: QuestionControlService) { }

  ngOnInit() {
    this.form = this.qcs.toFormGroup(this.questions);
  }

  selectHos() {
    this.form.value.submitter = "headOfSchool";
    this.display = "Head of School";
  }

  selectResearcher() {
    this.form.value.submitter = "researcher";
    this.display = "Researcher";
  }

  changeRole() {
    if (this.form.value.submitter == "researcher") {
      this.form.value.submitter = "headOfSchool";
      this.display = "Head of School";
    }
    else {
      this.form.value.submitter = "researcher";
      this.display = "Researcher";
    }
  }
  onSubmit() {
    this.payload = JSON.stringify(this.form.value);
  }


}
