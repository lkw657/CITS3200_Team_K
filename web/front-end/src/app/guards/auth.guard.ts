import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FlashMessagesService } from "angular2-flash-messages";

@Injectable()
export class AuthGuard implements CanActivate{
  constructor(
    private authService: AuthService,
    private flashMessage: FlashMessagesService,
    private router: Router
  ){}

  //Divert user to login if not logged in and tries to access any pages
  canActivate(){
    if(this.authService.loggedIn()){
      return true;
    }
    else{
      this.router.navigate(['']);
      this.flashMessage.show('Please login to access page', { cssClass: 'align-top alert alert-danger', timeout: 5000 });
      return false;
    }
  }
}