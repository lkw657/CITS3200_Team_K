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
  displayNew: boolean = false;
  displayDelete: boolean = false;

  ngOnInit() {
    this.getEmails();
  }

  getEmails() {
    // Get users to show admin
    this.dashboardService.getAllEmails().subscribe(allEmails => {
      this.allEmails = allEmails;
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
    this.displayNew = false;
    this.displayDelete = false;
    window.scrollTo(0, 0);
  }

  showDelete(email) {
    this.currentEmail = email;
    this.displayAll = false;
    this.displayDelete = true;
    window.scrollTo(0, 0);
  }

  // This will hide all content besides the delete screen.
  showNew() {

    // Creates blank email
    this.currentEmail = {
      role: '',
      email: '',
      emailContent: ''
    };

    this.displayAll = false;
    this.displayNew = true;
    window.scrollTo(0, 0);
  }

  // Update Email database through the backend
  onEmailEdit() {
    this.dashboardService.updateEmail(this.currentEmail).subscribe(data => {
      if (data.success) {
        this.flashMessage.show(data.msg, { cssClass: 'align-top alert alert-success', timeout: 3000 });
        this.getEmails();
        this.displayAll = true;
        this.displayEdit = false;
        window.scrollTo(0, 0);
      }
      else {
        this.flashMessage.show(data.msg, { cssClass: 'align-top alert alert-danger', timeout: 5000 });
        window.scrollTo(0, 0);
      }
    });

  }

  // Adds new email to DB
  saveNewEmail() {

    this.dashboardService.newEmail(this.currentEmail).subscribe(data => {
      if (data.success) {
        this.flashMessage.show(data.msg, { cssClass: 'align-top alert alert-success', timeout: 3000 });
        this.getEmails();
        this.displayAll = true;
        this.displayNew = false;
        window.scrollTo(0, 0);
      }
      else {
        this.flashMessage.show(data.msg, { cssClass: 'align-top alert alert-danger', timeout: 5000 });
        window.scrollTo(0, 0);
      }
    });
  }

  // Delete email from database
  deleteEmail() {
    window.scrollTo(0, 0);
    this.dashboardService.removeEmail(this.currentEmail).subscribe(data => {
      if (data.success) {
        this.getEmails();
        this.flashMessage.show(data.msg, { cssClass: 'align-top alert alert-success', timeout: 3000 });
        this.displayAll = true;
        this.displayDelete = false;
      }
      else {
        this.flashMessage.show(data.msg, { cssClass: 'align-top alert alert-danger', timeout: 3000 });
        window.scrollTo(0, 0);
      }
    });
  }
}