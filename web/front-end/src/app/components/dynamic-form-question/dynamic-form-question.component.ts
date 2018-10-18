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
  @Input() form: FormGroup;

  get isValid() { return this.form.controls[this.question.key].valid; }
  counter(i: number) {
      return new Array(i);
  }

  getCount() {
    return Object.keys(this.form.controls).length;
  }

  removeLeadingZeroes(field: string) {
    const fieldc: FormControl = this.form.controls[field] as FormControl;
    let num : Number = parseInt(fieldc.value, 10);
    if(num > 0){
      fieldc.patchValue(parseInt(fieldc.value, 10));
    } else {
      fieldc.patchValue(parseInt('0', 10));
    }
  }

  calcTotal(field: string) {
    const array: FormArray = this.form.controls[field] as FormArray;
    let sum = 0;
    for (let i = 0 ; i < array.controls.length - 1 ; i++ ) {
      let num  = parseInt(array.controls[i].value, 10);
      if ( !isNaN(num) && num > 0 ) {
        sum = sum + num;
      } else if ( num < 0 ){
        num = 0;
      }
      array.controls[i].patchValue(num);
    }
    array.controls[array.controls.length - 1].setValue(sum);
  }
}
