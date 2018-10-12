import { Component, OnInit } from '@angular/core';
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
  selector: 'app-approvals-dashboard',
  templateUrl: './approvals-dashboard.component.html',
  styleUrls: ['./approvals-dashboard.component.css']
})
export class ApprovalsDashboardComponent implements OnInit {

  // View Objects
  userApprovals: any;
  approvalView: any;
  historicalSubmissionView: any;
  approval: any = {};
  formHistory: any;
  role: String;
  submitter: String;
  school: String;

  // View Selectors
  showAllApprovals = true;
  showSingleApproval = false;
  showHistory = false;
  showHistoricalSubmission = false;

  questions: any = [];
  answers: Answer[] = [];
  isLoaded = false;
  qset_id: string = '';
  comments: any[] = [];
  appsLoaded = false;
  submitting = false;

  @ViewChild(DynamicFormComponent)
  private dform: DynamicFormComponent;

  constructor(
    private router: Router,
    private flashMessage: FlashMessagesService,
    private dashboardService: DashboardService,
    private questionService: QuestionService
  ) { }

  ngOnInit() {
    this.refreshApprovals();
  }

  // Refreshes approvals when Dashboard is loaded
  refreshApprovals() {
    this.appsLoaded = false;
    // Get forms awaiting approval by user
    this.dashboardService.getUserApprovals().subscribe(data => {
      this.userApprovals = data.approvals;
      this.appsLoaded = true;
    },
      err => {
        console.log(err);
        this.router.navigate(['/home']);
        return false;
      });
  }

  // View selecting functions

  // Populates dashboard with all approvals awaiting staff member
  showApprovals() {
    window.scrollTo(0, 0);
    this.showAllApprovals = true;
    this.showSingleApproval = false;
    this.refreshApprovals();
  }

  // Shows a single approval when View Form is clicked
  showApproval(form) {
    window.scrollTo(0, 0);
    this.showSingleApproval = true;
    this.showAllApprovals = false;

    this.approvalView = form;
    this.role = this.approvalView.status.split(" ")[1];
    this.school = this.approvalView.school;
    this.submitter = this.approvalView.submitter;
    this.createQuestionList(this.approvalView.questionSet, this.approvalView['answers']);
  }

  // Resubmits form for approval
  submitForm(response, acting) {
    this.submitting = true;
    let commentArray = [];
    // Create approval object with new comments and response
    let numFormControls = this.dform.form.controls[Object.keys(this.dform.form.controls).length].length;
    for ( var i = 0 ; i < numFormControls ; i++ ){
      if( this.dform.form.controls[Object.keys(this.dform.form.controls).length].value[i] != null ){
        commentArray.push({ order: i, text: this.dform.form.controls[Object.keys(this.dform.form.controls).length].value[i] });
      }
    }
    
    // Create approval object to be sent to back end
    this.approval.comments = commentArray;
    this.approval.response = response;
    this.approval.acting = acting;
    this.approval.form_id = this.approvalView._id;

    this.questionService.formResponse(this.approval).subscribe(data => {
      if (data.success) {
        this.flashMessage.show(data.msg, { cssClass: 'align-top alert alert-success', timeout: 3000 });
        this.submitting = false;
        this.refreshApprovals();
        this.refreshApprovals();
        this.showAllApprovals = true;
        this.showSingleApproval = false;
        window.scrollTo(0, 0);
      }
    },
      err => {
        this.flashMessage.show(err.error.msg, { cssClass: 'align-top alert alert-danger', timeout: 5000 });
        this.submitting = false;
        window.scrollTo(0, 0);
      }
    );
  }

  // Displays a dashboard of all historical forms attached to single form
  showFormHistory(history) {
    this.showHistory = true;
    this.showSingleApproval = false;
    window.scrollTo(0, 0);

    this.formHistory = [];
    for (let i in this.userApprovals) {
      if (history.includes(this.userApprovals[i]._id)) {
        this.formHistory.push(this.userApprovals[i]);
      }
    }
  }

  // Goes back to single form display and clears history array
  backToForm() {
    this.showHistory = false;
    this.showSingleApproval = true;
    this.formHistory = undefined;
    window.scrollTo(0, 0);
  }

  // Displays a single historical form
  showHistoricSubmission(form) {
    this.historicalSubmissionView = form;
    this.showHistory = false;
    this.showHistoricalSubmission = true;
    window.scrollTo(0, 0);
  }

  // Goes back to history dashboard 
  backToHistory() {
    this.showHistory = true;
    this.showHistoricalSubmission = false;
    window.scrollTo(0, 0);
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
            allowComments: true,
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
            allowComments: true,
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
            allowComments: true,
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
            allowComments: true,
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
}
