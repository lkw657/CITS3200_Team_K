import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { baseURI } from '../../config';
import { DashboardService } from '../../services/dashboard.service';
import { FlashMessagesService } from "angular2-flash-messages";


@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dashboardService: DashboardService,
    private http: HttpClient,
    private flashMessage: FlashMessagesService
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
      (err) => {
        this.router.navigate(['/approvalsDashboard']);
        this.flashMessage.show('This form does not exist!', { cssClass: 'align-bottom alert alert-danger', timeout: 3000 });
      }
    );
  }

  onReject() {
    this.verifying = true;
    this.http.post(baseURI + '/mail/rejectFormAccess', { 'mailID': this.mailID, 'secret': this.secret }).subscribe(
      (data) => {
        this.verifying = false;
        console.log(data)
        this.refreshApprovals();
        this.router.navigate(['/approvalsDashboard']);
      },
      (err) => {
        this.router.navigate(['/approvalsDashboard']);
        this.flashMessage.show(err.error.msg, { cssClass: 'align-bottom alert alert-danger', timeout: 3000 });
      }
    );
    this.verifying = false;
  }

  ngOnInit() {
    this.mailID = this.route.snapshot.paramMap.get('mailID');
    this.secret = this.route.snapshot.paramMap.get('secret');
  }

  // Refreshes approvals when Dashboard is loaded
  refreshApprovals() {
    // Get forms awaiting approval by user
    this.dashboardService.getUserApprovals().subscribe(data => {
    },
      err => {
        return false;
      });
  }
}
