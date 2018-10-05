import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionBase } from '../../classes/question-base';


@Component({
  selector: 'app-question',
  templateUrl: './dynamic-form-question.component.html',
})

export class DynamicFormQuestionComponent {

  @Input() question: QuestionBase<any>;
  @Input() form : FormGroup;
  
  get isValid() { return this.form.controls[this.question.key].valid; }
  counter(i: number) {
      return new Array(i);
  }


}
