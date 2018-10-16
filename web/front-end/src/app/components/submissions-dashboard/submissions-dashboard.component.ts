import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DashboardService } from '../../services/dashboard.service';
import { QuestionService } from '../../services/question.service';
import { FlashMessagesService } from "angular2-flash-messages";
import { Router } from '@angular/router';

import { AfterViewInit, ViewChild } from '@angular/core';

import { QuestionBase } from '../../classes/question-base';
import { Answer } from '../../classes/answer';

import { TextboxQuestion } from '../../classes/question-textbox';
import { TextQuestion } from '../../classes/question-text';
import { MoneyQuestion } from '../../classes/question-money';
import { MoneyArrayQuestion } from '../../classes/question_moneyarray';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';


@Component({
  selector: 'app-submissions-dashboard',
  templateUrl: './submissions-dashboard.component.html',
  styleUrls: ['./submissions-dashboard.component.css']
})
export class SubmissionsDashboardComponent implements OnInit {

  // View Objects
  userSubmissions: any;
  submissionView: any;
  historicalSubmissionView: any;
  submission: any = {};
  formHistory: any;

  // View Selectors
  showAllSubmissions = true;
  showSingleSubmission = false;
  resolveComments = false;
  showHistory = false;
  showHistoricalSubmission = false;

  questions: any = [];
  answers: Answer[] = [];
  isLoaded = false;
  qset_id: string = '';
  comments: any[] = [];
  subsLoaded = false;
  resubmitting = false;

  @ViewChild(DynamicFormComponent)
  private dform: DynamicFormComponent;

  constructor(
    private router: Router,
    private flashMessage: FlashMessagesService,
    private authService: AuthService,
    private dashboardService: DashboardService,
    private questionService: QuestionService
  ) { }

  ngOnInit() {
    this.refreshSubmissions();
  }

  refreshSubmissions() {
    // Get all forms submitted by user
    this.dashboardService.getUserSubmissions().subscribe(data => {
      this.userSubmissions = data.submissions;
      this.subsLoaded = true;
    },
      err => {
        this.flashMessage.show("An Error has Occurred - Please try again later!", { cssClass: 'align-top alert alert-danger', timeout: 5000 });
        console.log(err);
        return false;
      });
  }

  // Populates dashboard with all submissions that have not been resubmitted

  showSubmissions() {
    window.scrollTo(0, 0);
    this.showAllSubmissions = true;
    this.showSingleSubmission = false;
    this.resolveComments = false;
    this.refreshSubmissions();
  }

  createQuestionList(questionSet, ans) {
    let answers = this.createAnswerList(ans);

    this.questions = questionSet['questionList'];
    let qObjs: QuestionBase<any>[] = [];

    for (let i = 0; i < this.questions.length; i++) {
      let q = this.questions[i];
      if (q['type'] == 'textarea') {
        qObjs.push(
          new TextboxQuestion({
            key: i + 1,
            label: q.text,
            value: answers[i].answer,
            required: true,
            order: q.order,
            disabled: true,
            form_name: q.formName
          })
        );
      } else if (q['type'] == 'text') {
        qObjs.push(
          new TextQuestion({
            key: i + 1,
            label: q.text,
            value: answers[i].answer,
            required: true,
            order: q.order,
            disabled: true,
            form_name: q.formName
          })
        );
      } else if (q['type'] == 'money_single') {
        qObjs.push(
          new MoneyQuestion({
            key: i + 1,
            label: q.text,
            value: answers[i].answer,
            required: true,
            order: q.order,
            disabled: true,
            form_name: q.formName
          })
        );
      } else if (q['type'].indexOf("money_array") == 0) {
        let number_of_fields = 0;
        qObjs.push(
          new MoneyArrayQuestion({
            key: i + 1,
            label: q.text,
            required: true,
            order: q.order,
            value: answers[i].answer,
            number: parseInt(q['type'].substring(q['type'].length - 1)),
            disabled: true,
            form_name: q.formName
          })
        );
      }
    }

    this.isLoaded = true;
    this.questions = qObjs.sort((a, b) => a.order - b.order);
    this.qset_id = this.questions['_id'];
  }

  createAnswerList(answers): Answer[] {
    this.answers = answers;
    let aObjs: Answer[] = [];
    for (let i = 0; i < answers.length; i++) {
      aObjs.push(
        new Answer({
          order: answers[i]['order'],
          answer: answers[i]['answer']
        })
      );
    }
    return aObjs;
  }

  // Shows a single submission when View Form is clicked
  showSubmission(form) {
    window.scrollTo(0, 0);
    this.showSingleSubmission = true;
    this.showAllSubmissions = false;

    this.submissionView = form;

    this.createQuestionList(this.submissionView.questionSet, this.submissionView['answers']);
    this.comments = this.submissionView.comments;

  }


  // Shows the questions that have comments relating to them on Provisional Approval
  resolve() {
    window.scrollTo(0, 0);
    this.showSingleSubmission = false;
    this.resolveComments = true;
  }

  // Resubmits form for approval

  resubmit() {
    this.resubmitting = true;
    // Create new submission
    this.submission.parent_id = this.submissionView._id;
    this.submission.answers = Object.values(this.dform.form.value);
    this.submission.school = this.submissionView.school;
    this.submission.submitter = this.submissionView.submitter;

    //Sends updated form for resubmission
    this.questionService.resubmit(this.submission).subscribe(data => {
      if (data.success) {
        this.flashMessage.show(data.msg, { cssClass: 'align-top alert alert-success', timeout: 3000 });
        this.resubmitting = false;
        this.refreshSubmissions();
        this.resolveComments = false;
        this.showAllSubmissions = true;
        window.scrollTo(0, 0);
      }
    },
      err => {
        this.flashMessage.show(err.error.msg, { cssClass: 'align-top alert alert-danger', timeout: 5000 });
        this.resubmitting = false;
        window.scrollTo(0, 0);
      }
    );
  }

  // Displays a dashboard of all historical forms attached to single form

  showFormHistory(history) {
    this.showHistory = true;
    this.showSingleSubmission = false;
    window.scrollTo(0, 0);

    this.formHistory = [];
    for (let i in this.userSubmissions) {
      if (history.includes(this.userSubmissions[i]._id)) {
        this.formHistory.push(this.userSubmissions[i]);
      }
    }
  }

  // Goes back to single form display and clears history array
  backToForm() {
    this.showHistory = false;
    this.showSingleSubmission = true;
    this.formHistory = undefined;
    window.scrollTo(0, 0);
  }

  // Displays a single historical form
  showHistoricSubmission(form) {
    console.log(form);
    this.historicalSubmissionView = form;
    this.showHistory = false;
    this.showHistoricalSubmission = true;
    window.scrollTo(0, 0);
    this.createQuestionList(this.historicalSubmissionView['questionSet'], this.historicalSubmissionView['answers']);
    this.comments = this.historicalSubmissionView['comments'];
  }

  // Goes back to history dashboard
  backToHistory() {
    this.showHistory = true;
    this.showHistoricalSubmission = false;
    window.scrollTo(0, 0);
  }

  // Saves role into form
  selectRole(role) {
    this.submissionView.submitter = role;
  }

  // Saves school into form
  selectSchool(school) {
    this.submissionView.school = school;
  }

  //Finds which questions have comments
  isCommented(comments, order) {
    for (let i in comments) {
      if (comments[i].order === order) {
        return true;
      };
    }
    return false;
  }

  // Gets the correct comment for display
  getComment(comments, order) {
    for (let i in comments) {
      if (comments[i].order === order) {
        return comments[i].text;
      };
    }
  }
}
