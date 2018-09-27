import { Component, OnInit, Input } from '@angular/core';

import { QuestionService } from '../../services/question.service';

import { QuestionBase } from '../../classes/question-base';
import { TextboxQuestion } from '../../classes/question-textbox';
import { TextQuestion } from '../../classes/question-text';
import { MoneyQuestion } from '../../classes/question-money';


@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.css'],
  providers: [ QuestionService ]
})
export class SubmissionComponent implements OnInit {

  questions: any[] = [];
  qset_id: string = '';
  qs : QuestionService;

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
          let field : any;
          if(q['type'] == 'textarea'){
            qObjs.push(
                new TextboxQuestion({
                    key: i+1,
                    label: q.text,
                    required: true,
                    order : q.order
                })
            );
          } else if (q['type'] == 'text'){
            qObjs.push(
                new TextQuestion({
                    key: i+1,
                    label: q.text,
                    required: true,
                    order : q.order
                })
            );
          } else if (q['type'] == 'money_single'){
            qObjs.push(
                new MoneyQuestion({
                    key: i+1,
                    label: q.text,
                    required: true,
                    order : q.order
                })
            );
          }
      }

      this.isLoaded = true;
      this.questions = qObjs.sort((a,b) => a.order - b.order);
      this.qset_id = questionSet['_id'];
    })
  }
}
