import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionBase } from '../../classes/question-base';


@Component({
  selector: 'app-question',
  templateUrl: './dynamic-form-question.component.html',
  styleUrls: ['./dynamic-form-question.component.css'],
})

export class DynamicFormQuestionComponent {

  @Input() question: QuestionBase<any>;
  @Input() form : FormGroup;

  total = 0;
  
  get isValid() { return this.form.controls[this.question.key].valid; }
  counter(i: number) {
      return new Array(i);
  }
}
