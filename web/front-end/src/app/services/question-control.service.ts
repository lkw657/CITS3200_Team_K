import { Injectable } from '@angular/core';
import { FormControl, FormGroup, FormArray, Validators } from '@angular/forms';

import { QuestionBase } from '../classes/question-base';

@Injectable()
export class QuestionControlService {
  constructor() { }

  toFormGroup(questions: QuestionBase<any>[] ) {
    let group: any = {};

    questions.forEach((question  : any) => {
      if(question.controlType === 'money_array'){
        let arrayofQuestions = [];
        for(var i = 0 ; i < question.number ; i++ ){
          arrayofQuestions.push(new FormControl(question.value || ''));
        }
        arrayofQuestions.push(new FormControl(question.value || ''));
        group[question.key] = new FormArray(arrayofQuestions);

      } else {
        group[question.key] = question.required ? new FormControl(question.value || '', Validators.required)
                                                : new FormControl(question.value || '');
      }
    });
    return new FormGroup(group);
  }
}
