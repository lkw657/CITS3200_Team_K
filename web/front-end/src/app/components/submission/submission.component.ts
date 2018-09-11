import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { QuestionBase } from '../../classes/question-base';
import { QuestionService } from '../../services/question.service';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.css'],
  providers: [ QuestionService ]
})
export class SubmissionComponent implements OnInit {

  questions: any[];
  constructor( service: QuestionService ) { 
    this.questions = service.getQuestions();
  }

  ngOnInit() {
  }
}
