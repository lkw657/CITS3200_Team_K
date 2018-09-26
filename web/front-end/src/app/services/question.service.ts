import { Injectable } from '@angular/core';
import { QuestionBase } from '../classes/question-base';
import { TextboxQuestion } from '../classes/question-textbox';
import { MoneyQuestion } from '../classes/question-money';

import { HttpClient } from '@angular/common/http';

function hashCode( x : string ) {
    console.log("X : " + x);
    var hash = 0, i, chr;
    if (x.length === 0) return hash;
    for (let i = 0; i < x.length; i++) {
      chr   = x.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
}


@Injectable()
export class QuestionService {

    HTTP: HttpClient;

    constructor(private http: HttpClient){
        this.HTTP = http;
    }

    getData(){
        return this.HTTP.get("http://localhost:3000/db/questionSet/latest");
    }

    getQuestions() {
        const data = this.HTTP.get("http://localhost:3000/db/questionSet/latest");
        let qObjs : QuestionBase<any> [] = [];

        data.toPromise()
        .then( (data) => {
            console.log(data);
            let questionList = data['questionList'];
            
            for(let i = 0 ; i < questionList.length ; i++ ){
                let q = questionList[i];
                qObjs.push(
                    new TextboxQuestion({
                        key: Math.random().toString(36).substring(7),
                        label: q.text,
                        required: true,
                        order : i
                    })
                );
            }
        })
        .catch( (err) => {
            console.log(err);
        })
        
        return qObjs.sort((a,b) => a.order - b.order);
    }

    /*getQuestions() {
 
        let questions: QuestionBase<any>[] = [
     
        new TextboxQuestion({
            key: Math.random().toString(35).substring(7),
            label: 'First name',
            value: 'Bombasto',
            required: true,
            order: 1
          }),
     
          new TextboxQuestion({
            key: Math.random().toString(35).substring(7),
            label: 'Email',
            type: 'email',
            order: 2
          })
        ];
     
        return questions.sort((a, b) => a.order - b.order);
    }*/
}

