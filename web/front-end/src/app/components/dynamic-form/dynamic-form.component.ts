import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { QuestionControlService } from '../../services/question-control.service';
import { QuestionBase } from '../../classes/question-base';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css'],
  providers: [ QuestionControlService ]
})
export class DynamicFormComponent implements OnInit {

  @Input() questions: QuestionBase<any> [] = [];
  form: FormGroup;
  payload = '';

  constructor( private qcs : QuestionControlService ) { }

  ngOnInit() {
    this.form = this.qcs.toFormGroup(this.questions);
  }

  onSubmit(){
    this.payload = JSON.stringify(this.form.value);
  }

}
