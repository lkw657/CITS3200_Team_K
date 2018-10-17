import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DashboardService } from '../../services/dashboard.service';
import { QuestionService } from '../../services/question.service';
import { FlashMessagesService } from "angular2-flash-messages";
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  user: any;
  userApprovals: any;
  userSubmissions: any;

  subsLoaded = false;
  appsLoaded = false;

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
    this.refreshSubmissions();
    this.refreshApprovals();
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

  // Refreshes approvals when Dashboard is loaded
  refreshApprovals() {
    // Get forms awaiting approval by user
    this.dashboardService.getUserApprovals().subscribe(data => {
      this.userApprovals = data.approvals;
      this.appsLoaded = true;
    },
      err => {
        console.log(err);
        return false;
      });
  }
}
