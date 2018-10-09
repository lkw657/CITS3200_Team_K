import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from "angular2-flash-messages";
import { Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-edit-emails',
  templateUrl: './edit-emails.component.html',
  styleUrls: ['./edit-emails.component.css']
})
export class EditEmailsComponent implements OnInit {

  constructor(
    private router: Router,
    private flashMessage: FlashMessagesService,
    private dashboardService: DashboardService
  ) { }

  allEmails: Object;
  currentEmail: Object;

  // What should be displayed
  displayAll: boolean = true;
  displayEdit: boolean = false;

  ngOnInit() {
    // Get users to show admin
    this.dashboardService.getAllEmails().subscribe(allEmails => {
      this.allEmails = allEmails;
      console.log(this.allEmails);
    },
      err => {
        console.log(err);
        return false;
      });
  }

  // This will hide all content besides the edit form
  showEdit(email) {
    this.currentEmail = email;
    this.displayAll = false;
    this.displayEdit = true;
    window.scrollTo(0, 0);
  }

  // This will show all users
  showAll() {
    this.displayAll = true;
    this.displayEdit = false;
    window.scrollTo(0, 0);
  }

  // Update Email database through the backend
  onEmailEdit() {
    this.dashboardService.updateEmail(this.currentEmail).subscribe(data => {
      if (data.success) {
        this.flashMessage.show(data.msg, { cssClass: 'align-top alert alert-success', timeout: 3000 });
        this.router.navigate(['/editEmails']);
      }
      else {
        this.flashMessage.show(data.msg, { cssClass: 'align-top alert alert-danger', timeout: 5000 });
        this.router.navigate(['/editEmails']);
      }
    });
    this.displayAll = true;
    this.displayEdit = false;
    window.scrollTo(0, 0);
  }
}