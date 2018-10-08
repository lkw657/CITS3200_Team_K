import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from "@angular/router";
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit { 

  user: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService
  ) { }

  ngOnInit() { 
  }

  onLogoutClick() {
    this.user = this.authService.getProfile();

    this.authService.logoutUser(this.user).subscribe(data => {
      if (data.success) {
        this.flashMessage.show(data.msg, { cssClass: 'align-top alert alert-success', timeout: 3000 });
        localStorage.clear();
        window.scrollTo(0, 0);
      }
    },
      err => {
        this.flashMessage.show(err.error.msg, { cssClass: 'align-top alert alert-danger', timeout: 5000 });
        window.scrollTo(0, 0);
      }
    );
  }
}
