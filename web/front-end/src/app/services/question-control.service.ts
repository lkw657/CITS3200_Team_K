import { Injectable } from '@angular/core';
import { FormControl, FormGroup, FormArray, Validators } from '@angular/forms';

import { QuestionBase } from '../classes/question-base';

@Injectable()
export class QuestionControlService {
  constructor() { }

  toFormGroup(questions: QuestionBase<any>[], display? : boolean ) {
    let group: any = {};
    if(display){
      for(let j = 0 ; j < questions.length; j++) {
        let question : any = questions[j];
        if(question.controlType === 'money_array'){

          let values : string[] = question.value.split(',');
          let sum = 0;
          let arrayofQuestions = [];

          for(let i = 0 ; i < question.number ; i++ ){
            sum += parseInt(values[i]);
            arrayofQuestions.push(new FormControl({value: values[i], disabled: true}));
          }

          arrayofQuestions.push(new FormControl( {value: sum || '', disabled: true }));
          console.log(arrayofQuestions);
          group[question.key] = new FormArray(arrayofQuestions);

        } else if ( question.controlType != 'money_array' ) {
          group[question.key] = question.required ? new FormControl({value: question.value || '', disabled: true}, Validators.required)
                                                  : new FormControl({value: question.value || '', disabled: true});
        }
      }
    } else if(!display) {
      questions.forEach((question : any) => {
        if(question.controlType === 'money_array'){
          let values : string[] = question.value.split(',');
          let sum = 0;
          let arrayofQuestions = [];

          for(let i = 0 ; i < question.number ; i++ ){
            sum += parseInt(values[i]);
            arrayofQuestions.push(new FormControl(values[i]));
          }

          arrayofQuestions.push(new FormControl( sum || ''));
          console.log(arrayofQuestions);
          group[question.key] = new FormArray(arrayofQuestions);
  
        } else {
          group[question.key] = question.required ? new FormControl(question.value || '', Validators.required)
                                                  : new FormControl(question.value || '');
        }
      });
    }
    return new FormGroup(group);
  }
}
