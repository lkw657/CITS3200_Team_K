import { Injectable } from '@angular/core';
import { FormControl, FormGroup, FormArray, Validators } from '@angular/forms';

import { QuestionBase } from '../classes/question-base';

@Injectable()
export class QuestionControlService {
  constructor() { }

  toFormGroup(questions: QuestionBase<any>[], display? : boolean, allow_comments? : boolean ) {
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
            arrayofQuestions.push(new FormControl({value: values[i] || '0', disabled: true}));
          }

          arrayofQuestions.push(new FormControl( {value: sum || '0', disabled: true }));

          group[question.key] = new FormArray(arrayofQuestions);

        } else if ( question.controlType != 'money_array' ) {
          group[question.key] = question.required ? new FormControl({value: question.value || '0', disabled: true}, Validators.required)
                                                  : new FormControl({value: question.value || '0', disabled: true});
        }
      }
    } else if(!display && !allow_comments) {
      questions.forEach((question : any) => {
        if(question.controlType === 'money_array'){
          if(question.value != null && question.value.length > 0){
            let values : string[] = question.value.split(',');
            let sum = 0;
            let arrayofQuestions = [];

            for(let i = 0 ; i < question.number ; i++ ){
              sum += parseInt(values[i]);
              arrayofQuestions.push(new FormControl(values[i] || '0'));
            }

            arrayofQuestions.push(new FormControl( sum || '0' ));
            console.log(arrayofQuestions);
            group[question.key] = new FormArray(arrayofQuestions);
          } else {
            let arrayofQuestions = [];
            for(let i = 0 ; i < question.number ; i++ ){
              arrayofQuestions.push(new FormControl('0'));
            }

            arrayofQuestions.push(new FormControl({value: '0', disabled: true}));
            console.log(arrayofQuestions);
            group[question.key] = new FormArray(arrayofQuestions);
          }
        } else {
          group[question.key] = question.required ? new FormControl(question.value || '', Validators.required)
                                                  : new FormControl(question.value || '');
        }
      });
    } else if(allow_comments) {
      let comments : any[] = [];
      for(let j = 0 ; j < questions.length; j++) {
        let question : any = questions[j];
        if(question.controlType === 'money_array'){
          if(question.value != null && question.value.length > 0){
            let values : string[] = question.value.split(',');
            let sum = 0;
            let arrayofQuestions = [];

            for(let i = 0 ; i < question.number ; i++ ){
              sum += parseInt(values[i]);
              arrayofQuestions.push(new FormControl({value: values[i] || '0', disabled: true}));
            }

            arrayofQuestions.push(new FormControl( {value: sum || '0', disabled: true} ));
            group[question.key] = new FormArray(arrayofQuestions);
          } else {
            let arrayofQuestions = [];
            for(let i = 0 ; i < question.number ; i++ ){
              arrayofQuestions.push(new FormControl({value: '0', disabled: true}));
            }

            arrayofQuestions.push(new FormControl({value: '0', disabled: true}));
            group[question.key] = new FormArray(arrayofQuestions);
          }
        } else {
          group[question.key] = question.required ? new FormControl({value: question.value || '', disabled: true}, Validators.required)
                                                  : new FormControl({value: question.value || '', disabled: true});
        }
        comments.push(new FormControl());
      }

      group[Object.keys(group).length + 1] = new FormArray(comments);
    }
    return new FormGroup(group);
  }
}
