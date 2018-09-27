import { Component, OnInit, Input } from '@angular/core';

import { QuestionService } from '../../services/question.service';

import { QuestionBase } from '../../classes/question-base';
import { TextboxQuestion } from '../../classes/question-textbox';
import { MoneyQuestion } from '../../classes/question-money';


@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.css'],
  providers: [ QuestionService ]
})
export class SubmissionComponent implements OnInit {

  questions: any[] = [];
  qs : QuestionService;
  version: string;
  constructor( service: QuestionService ) { this.qs = service; }
  questionList : any;
  isLoaded : boolean;

  ngOnInit() {
    let qObjs : QuestionBase<any> [] = [];
    this.qs.getData().subscribe(questionSet => {
      this.questionList = questionSet['questionList'];

      let qObjs : QuestionBase<any> [] = [];

      for(let i = 0 ; i < this.questionList.length ; i++ ){
          let q = this.questionList[i];
          qObjs.push(
              new TextboxQuestion({
                  key: i+1,
                  label: q.text,
                  required: true,
                  order : i
              })
          );
      }
      this.isLoaded = true;
      this.questions = qObjs.sort((a,b) => a.order - b.order);
    })
  }
}
