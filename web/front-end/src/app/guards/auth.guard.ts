import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate{
  constructor(
    private authService: AuthService,
    private router: Router
  ){}

  //Divert user to login if not logged in and tries to access any pages
  canActivate(){
    if(this.authService.loggedIn()){
      return true;
    }
    else{
      this.router.navigate(['']);
      return false;
    }
  }
}