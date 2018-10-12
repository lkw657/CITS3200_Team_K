import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { QuestionControlService } from '../../services/question-control.service';
import { QuestionService } from '../../services/question.service';
import { QuestionBase } from '../../classes/question-base';
import { Answer } from '../../classes/answer'

import { FlashMessagesService } from "angular2-flash-messages";
import { Router } from '@angular/router';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css'],
  providers: [QuestionControlService]
})
export class DynamicFormComponent implements OnInit {

  submitting = false;

  @Input() questions: QuestionBase<any>[] = [];
  @Input() qset_id : string = '';
  @Input() comments : any[] = [];
  @Input() display_only : boolean = false;
  @Input() resubmit : boolean = false;
  @Input() allow_comments : boolean = false;
  @Input() approver : String = '';
  @Input() submitter : String = '';
  @Input() school : String = '';

  form: FormGroup;
  submission: any = {};
  payload = '';

  constructor(
    private router: Router,
    private flashMessage: FlashMessagesService,
    private qcs: QuestionControlService,
    private questionService: QuestionService ) { }

  ngOnInit() {
    if(this.display_only) {
      this.form = this.qcs.toFormGroup(this.questions, true);
      this.form.valueChanges.subscribe( (data) => { console.log(data);} )
    } else if (this.allow_comments) {
      this.form = this.qcs.toFormGroup(this.questions, false , true);
    } else {
      this.form = this.qcs.toFormGroup(this.questions);
    }

  }

  findspecificComment(order: number){
    if( this.comments!= undefined && this.comments.find(x => x.order === order) != undefined ){
      return this.comments.find(x => x.order === order).text;
    }
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

    this.submitting = true;
    this.questionService.newSubmission(this.submission).subscribe(data => {
      if (data.success) {
        this.submitting = false;
        this.flashMessage.show(data.msg, { cssClass: 'align-top alert alert-success', timeout: 3000 });
        this.router.navigate(['/submissionsDashboard']);
      }
    },
    err => {
      this.submitting = false;
      this.flashMessage.show(err.error.msg, { cssClass: 'align-top alert alert-danger', timeout: 5000 });
      window.scrollTo(0, 0);
    }
  );
  }
}
