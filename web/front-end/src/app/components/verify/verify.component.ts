import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { baseURI } from '../../config';
import { DashboardService } from '../../services/dashboard.service';


@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private dashboardService: DashboardService,
    private http: HttpClient
  ) { }

  secret: string = '';
  mailID: string = '';
  verifying = false;

  onAccept() {
    this.verifying = true;
    this.http.post(baseURI + '/mail/verifyFormAccess', { 'mailID': this.mailID, 'secret': this.secret }).subscribe(
      (data) => {
        this.verifying = false;
        console.log(data)
        this.refreshApprovals();
        this.router.navigate(['/approvalsDashboard']);
      },
      (err) => console.log(err)
    );
  }

  onReject() {
    this.verifying = true;
    console.log("Rejected!!");
    this.verifying = false;
  }

  ngOnInit() {
    this.mailID = this.route.snapshot.paramMap.get('mailID');
    this.secret = this.route.snapshot.paramMap.get('secret');
  }

  // Resfreshes approvals when Dashboard is loaded
  refreshApprovals() {
    // Get forms awaiting approval by user
    this.dashboardService.getUserApprovals().subscribe(data => {
    },
      err => {
        return false;
      });
  }
}
