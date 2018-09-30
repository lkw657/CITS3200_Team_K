import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DashboardService } from '../../services/dashboard.service';
import { QuestionService } from '../../services/question.service';
import { FlashMessagesService } from "angular2-flash-messages";
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  // View Objects
  user: any;
  userSubmissions: any;
  userApprovals: any;
  submissionView: any;
  historicalSubmissionView: any;
  submission: any = {};
  approvalView: any;
  formHistory: any;

  // View Selectors
  select = true;
  submissions = false;
  approvals = false;
  resolve = false;
  showHistory = false;
  showHistoricalSubmission = false;
  showSubmission = false;
  showApproval = false;

  constructor(
    private router: Router,
    private flashMessage: FlashMessagesService,
    private authService: AuthService,
    private dashboardService: DashboardService,
    private questionService: QuestionService
  ) { }

  ngOnInit() {
    // Gets current user profile on page render
    this.user = this.authService.getProfile();
  }

  // View selecting functions
  showSubmissions() {
    window.scrollTo(0, 0);
    this.approvals = false;
    this.select = false;
    this.submissions = true;
    this.showSubmission = false;
    this.resolve = false;
    this.refreshSubmissions();
  }

  showSingleSubmission(form) {
    window.scrollTo(0, 0);
    this.showSubmission = true;
    this.submissions = false;

    this.submissionView = form;

    //DEVELOPMENT ONLY - TO BE DELETED
    this.submissionView.comments = [{ order: 1, text: "Q2 - Here is a comment" }, { order: 5, text: "Q6 - Here is another comment" }]
  }

  showSingleApproval() {
    window.scrollTo(0, 0);
    this.showApproval = true;
    this.approvals = false;
  }

  showApprovals() {
    window.scrollTo(0, 0);
    this.approvals = true;
    this.select = false;
    this.submissions = false;
    this.showApproval = false;
    this.refreshApprovals();
  }

  resolveComments() {
    window.scrollTo(0, 0);
    this.showSubmission = false;
    this.resolve = true;
  }

  resubmit() {

    // Create new submission
    this.submission.answers = this.submissionView.answers.map(a => a.answer);
    this.submission.school = this.submissionView.school;
    this.submission.submitter = this.submissionView.submitter;
    this.submission.qset_id = this.submissionView.questionSet._id;
    this.submission.history = [];
    this.submission.history.push(this.submissionView._id);

    if (this.submissionView.history) {
      for (let i in this.submissionView.history) {
        this.submission.history.push(this.submissionView.history[i]);
      }
    }

    this.questionService.newSubmission(this.submission).subscribe(data => {
      if (data.success) {

        //Set new status on old copy of form and update in db
        this.submissionView.status = 'resubmitted';
        this.questionService.updateSubmission(this.submissionView).subscribe(data => {
          if (data.success) {
            this.flashMessage.show(data.msg, { cssClass: 'align-top alert alert-success', timeout: 3000 });
            this.refreshSubmissions();
            window.scrollTo(0, 0);
          }
        },
          err => {
            this.flashMessage.show(err.error.msg, { cssClass: 'align-top alert alert-danger', timeout: 5000 });
            window.scrollTo(0, 0);
          }
        );
      }
    },
      err => {
        this.flashMessage.show(err.error.msg, { cssClass: 'align-top alert alert-danger', timeout: 5000 });
        window.scrollTo(0, 0);
      }
    );
  }

  // Saves role into form and changes view
  selectRole(role) {
    this.submissionView.submitter = role;
  }

  // Saves school into form and changes view
  selectSchool(school) {
    this.submissionView.school = school;
  }

  showFormHistory(history) {
    this.showHistory = true;
    this.showSubmission = false;
    window.scrollTo(0, 0);

    this.formHistory = [];
    for (let i in this.userSubmissions) {
      if (history.includes(this.userSubmissions[i]._id)) {
        this.formHistory.push(this.userSubmissions[i]);
      }
    }
  }

  backToForm() {
    this.showHistory = false;
    this.showSubmission = true;
    this.formHistory = undefined;
    window.scrollTo(0, 0);
  }

  backToHistory() {
    this.showHistory = true;
    this.showHistoricalSubmission = false;
    window.scrollTo(0, 0);
  }

  showHistoricSubmission(form) {
    this.historicalSubmissionView = form;
    this.showHistory = false;
    this.showHistoricalSubmission = true;
    window.scrollTo(0, 0);
  }

  refreshSubmissions() {
    // Get all forms submitted by user  
    this.dashboardService.getUserSubmissions().subscribe(data => {
      this.userSubmissions = data.submissions;
    },
      err => {
        console.log(err);
        return false;
      });
  }

  refreshApprovals() {
    // Get forms awaiting approval by user
    this.dashboardService.getUserApprovals().subscribe(data => {
      this.userApprovals = data.approvals;
      console.log(this.userApprovals);
    },
      err => {
        console.log(err);
        return false;
      });
  }

  // DEVELOPMENT ONLY - REMOVE
  changeIT() {
    this.user.isIT = !this.user.isIT;
  }
}
