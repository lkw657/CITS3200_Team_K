import { Component, Input } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { QuestionBase } from '../../classes/question-base';


@Component({
  selector: 'app-question',
  templateUrl: './dynamic-form-question.component.html',
  styleUrls: ['./dynamic-form-question.component.css'],
})

export class DynamicFormQuestionComponent {

  @Input() question: QuestionBase<any>;
  @Input() form : FormGroup;

  get isValid() { return this.form.controls[this.question.key].valid; }
  counter(i: number) {
      return new Array(i);
  }

  getCount(){
    return Object.keys(this.form).length + 1;
  }

  calcTotal(field: string) {
    let array : FormArray = this.form.controls[field] as FormArray;
    let sum : number = 0;
    for(let i = 0 ; i < array.controls.length - 1 ; i++ ){
      let num : number = parseInt(array.controls[i].value);
      if(!isNaN(num)){ 
        sum = sum + num;
      }
    }
    array.controls[array.controls.length - 1].setValue(sum);
  }
}
