import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from "angular2-flash-messages";
import { Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-edit-users',
  templateUrl: './edit-users.component.html',
  styleUrls: ['./edit-users.component.css']
})
export class EditUsersComponent implements OnInit {

  constructor(
    private router: Router,
    private flashMessage: FlashMessagesService,
    private dashboardService: DashboardService
  ) { }

  allUsers: Object;
  currentUser: Object;

  //What to display?
  displayAll: boolean = true;
  displayEdit: boolean = false;

  ngOnInit() {
    //Get users to show admin
    this.dashboardService.getAllUsers().subscribe(allUsers => {
      this.allUsers = allUsers;
    },
      err => {
        console.log(err);
        return false;
      });
  }

  //This will hide all content besides the edit form.
  showEdit(user) {
    this.currentUser = user;
    this.displayAll = false;
    this.displayEdit = true;
    window.scrollTo(0, 0);
  }

  //This will hide all content besides the edit form.
  showAll() {
    this.displayAll = true;
    this.displayEdit = false;
    window.scrollTo(0, 0);
  }

  //Update User database through the backend
  onUserEdit() {
    this.dashboardService.updateUser(this.currentUser).subscribe(data => {
      if (data.success) {
        this.flashMessage.show(data.msg, { cssClass: 'align-top alert alert-success', timeout: 3000 });
        this.router.navigate(['/editUsers']);
      }
      else {
        this.flashMessage.show(data.msg, { cssClass: 'align-top alert alert-danger', timeout: 5000 });
        this.router.navigate(['/editUsers']);
      }
    });
    this.displayAll = true;
    this.displayEdit = false;
    window.scrollTo(0, 0);
  }

  deleteUser(user) {
    window.scrollTo(0, 0);
    this.dashboardService.removeUser(user).subscribe(data => {
      if (data.success) {
        //Get users to show admin
        this.dashboardService.getAllUsers().subscribe(allUsers => {
          this.allUsers = allUsers;
        },
          err => {
            console.log(err);
            return false;
          });
        this.flashMessage.show(data.msg, { cssClass: 'align-top alert alert-success', timeout: 3000 });
        this.router.navigate(['/editUsers']);
      }
      else {
        this.flashMessage.show(data.msg, { cssClass: 'align-top alert alert-danger', timeout: 3000 });
        this.router.navigate(['/editUsers']);
      }
    });
  }

}
