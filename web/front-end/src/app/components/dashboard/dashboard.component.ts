import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: any;
  select = true;
  submissions = false;
  approvals = false;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.user = this.authService.getProfile();
  }

  //View selecting functions
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

  //DEVELOPMENT ONLY - REMOVE
  changeIT(){
    this.user.isIT = !this.user.isIT;
  }
}
