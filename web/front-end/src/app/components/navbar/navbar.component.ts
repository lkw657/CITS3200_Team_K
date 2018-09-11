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
  
  //These will be stored in localStorage on login and accessed by navbar
  // fname: string = 'David';
  // lname: string = 'Weight';
  // role: string = 'staff';
  loggedIn: boolean = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService
  ) { }

  ngOnInit() { 
  }

  onLogoutClick() {
    localStorage.clear();
    this.loggedIn=!this.loggedIn;

    this.flashMessage.show('You are logged out', {
      cssClass: 'alert-success',
      timeout: 3000
    });
    
    this.router.navigate(['/']);
    return false;
  }
}
