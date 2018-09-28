import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: any;
  userSubmissions: any;
  userApprovals: any;
  select = true;
  submissions = false;
  approvals = false;

  showSubmission = false;
  showApproval = false;

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService
  ) { }

  ngOnInit() {
    // Gets current user profile on page render
    this.user = this.authService.getProfile();

    // Get all forms submitted by user  
    this.dashboardService.getUserSubmissions().subscribe(data => {
      this.userSubmissions = data.submissions;
      console.log(this.userSubmissions);
    },
      err => {
        console.log(err);
        return false;
      });

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

  // View selecting functions
  showSubmissions() {
    this.approvals = false;
    this.select = false;
    this.submissions = true;
    this.showSubmission = false;
  }

  showSingleSubmission() {
    this.showSubmission = true;
    this.submissions = false;
  }

  showSingleApproval() {
    this.showApproval = true;
    this.approvals = false;
  }

  showApprovals() {
    this.approvals = true;
    this.select = false;
    this.submissions = false;
    this.showApproval = false;
  }

  // DEVELOPMENT ONLY - REMOVE
  changeIT() {
    this.user.isIT = !this.user.isIT;
  }
}
