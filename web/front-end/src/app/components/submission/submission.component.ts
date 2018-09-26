import { Component, OnInit, Input } from '@angular/core';

import { QuestionService } from '../../services/question.service';
@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.css'],
  providers: [ QuestionService ]
})
export class SubmissionComponent implements OnInit {

  questions: any[] = [];
  qcs : QuestionService;
  constructor( service: QuestionService ) { this.qcs = service; }

  ngOnInit() {
    this.questions = this.qcs.getQuestions();
  }
}
