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
  @Input() version : string = '';
  form: FormGroup;
  school: String;
  submitter: String;
  school_display: String;
  submitter_display: String;
  answers: any[];
  payload = '';

  constructor( 
    private router: Router,
    private flashMessage: FlashMessagesService,
    private qcs: QuestionControlService,
    private questionService: QuestionService ) { }

  ngOnInit() {
    this.form = this.qcs.toFormGroup(this.questions);
  }

  // Saves role into form and changes view
  selectRole(role, display) {
    this.submitter = role;
    this.submitter_display = display;
  }

  // Saves school into form and changes view
  selectSchool(school, display) {
    this.school = school;
    this.school_display = display;
  }

  // DEVELOPMENT - THIS NEEDS TO CHANGE TO SUBMIT TO BACKEND
  onSubmit() {
    this.form.value.school = this.school;
    this.form.value.submitter = this.submitter;
    this.form.value.version = this.version;

    this.questionService.newSubmission(this.form.value).subscribe(data => {
      if (data.success) {
        this.flashMessage.show(data.msg, { cssClass: 'align-top alert alert-success', timeout: 3000 });
        this.router.navigate(['/dashboard']);
      }
      else {
        this.flashMessage.show(data.msg, { cssClass: 'align-top alert alert-danger', timeout: 5000 });
        this.router.navigate(['/submission']);
      }
    });
  }
}
