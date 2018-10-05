import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { QuestionControlService } from '../../services/question-control.service';
import { QuestionService } from '../../services/question.service';
import { QuestionBase } from '../../classes/question-base';

import { FlashMessagesService } from "angular2-flash-messages";
import { Router } from '@angular/router';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css'],
  providers: [QuestionControlService]
})
export class DynamicFormComponent implements OnInit {

  @Input() questions: QuestionBase<any>[] = [];
  @Input() qset_id : string = '';
  form: FormGroup;
  school: String;
  submitter: String;
  school_display: String;
  submitter_display: String;
  submission: any = {};
  payload = '';

  constructor(
    private router: Router,
    private flashMessage: FlashMessagesService,
    private qcs: QuestionControlService,
    private questionService: QuestionService ) { }

  ngOnInit() {
    this.form = this.qcs.toFormGroup(this.questions);
    this.form.valueChanges.subscribe( (data) => { console.log(data);} )
  }

  // Saves role into form and changes view
  selectRole(role) {
    this.submitter = role;
  }

  // Saves school into form and changes view
  selectSchool(school) {
    this.school = school;
  }

  onSubmit() {
    this.submission.answers = Object.values(this.form.value);
    this.submission.school = this.school;
    this.submission.submitter = this.submitter;
    this.submission.qset_id = this.qset_id;

    console.log(this.submission.answers);

    this.questionService.newSubmission(this.submission).subscribe(data => {
      if (data.success) {
        this.flashMessage.show(data.msg, { cssClass: 'align-top alert alert-success', timeout: 3000 });
        this.router.navigate(['/submissionsDashboard']);
      }
    },
    err => {
      this.flashMessage.show(err.error.msg, { cssClass: 'align-top alert alert-danger', timeout: 5000 });
      window.scrollTo(0, 0);
    }
  );
  }
}
