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

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService
  ) { }

  ngOnInit() {
    // Gets current user profile on page render
    this.user = this.authService.getProfile();

    // Get all forms submitted by user  
    this.dashboardService.getUserSubmissions().subscribe(res => {
      this.userSubmissions = res;
    },
      err => {
        console.log(err);
        return false;
      });

    // Get forms awaiting approval by user
    this.dashboardService.getUserApprovals().subscribe(res => {
      this.userApprovals = res;
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
  }

  showApprovals() {
    this.approvals = true;
    this.select = false;
    this.submissions = false;
  }

  // DEVELOPMENT ONLY - REMOVE
  changeIT() {
    this.user.isIT = !this.user.isIT;
  }
}
