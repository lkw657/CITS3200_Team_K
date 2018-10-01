import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DashboardService } from '../../services/dashboard.service';
import { QuestionService } from '../../services/question.service';
import { FlashMessagesService } from "angular2-flash-messages";
import { Router } from '@angular/router';

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
    },
      err => {
        console.log(err);
        return false;
      });
  }

  // View selecting functions

  // Populates dashboard with all submissions that have not been resubmitted
  showSubmissions() {
    window.scrollTo(0, 0);
    this.showAllSubmissions = true;
    this.showSingleSubmission = false;
    this.resolveComments = false;
    this.refreshSubmissions();
  }

  // Shows a single submission when View Form is clicked
  showSubmission(form) {
    window.scrollTo(0, 0);
    this.showSingleSubmission = true;
    this.showAllSubmissions = false;

    this.submissionView = form;

    //DEVELOPMENT ONLY - TO BE DELETED
    this.submissionView.comments = [{ order: 1, text: "Q2 - Here is a comment" }, { order: 5, text: "Q6 - Here is another comment" }]
  }

  // Shows the questions that have comments relating to them on Provisional Approval
  resolve() {
    window.scrollTo(0, 0);
    this.showSingleSubmission = false;
    this.resolveComments = true;
  }

  // Resubmits form for approval
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
            this.resolveComments = false;
            this.showAllSubmissions = true;
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
    this.historicalSubmissionView = form;
    this.showHistory = false;
    this.showHistoricalSubmission = true;
    window.scrollTo(0, 0);

    //DEVELOPMENT ONLY - TO BE DELETED
    this.historicalSubmissionView.comments = [{ order: 1, text: "Q2 - Here is a HISTORICAL comment" }, { order: 5, text: "Q6 - Here is another HISTORICAL comment" }]
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
