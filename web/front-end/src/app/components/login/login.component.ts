import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from "@angular/router";
import { logging } from 'protractor';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  number: String;
  password: String;
  loggingIn = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService
  ) { }

  ngOnInit() {
    if (this.authService.getProfile().loggedIn) {
      this.router.navigate(['/home']);
    }
    this.authService.redirectUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
  }

  //Submit button sends user info to backend for authentication
  onLoginSubmit() {
    this.loggingIn = true;
    const login = {
      number: this.number,
      password: this.password
    }

    //Authenticate user in backend
    this.authService.authenticateUser(login).subscribe(data => {

      //Renders homepage if login is ok
      if (data.success) {
        this.flashMessage.show(data.msg,
          {
            cssClass: 'alert-success',
            timeout: 3000
          });
        data.user.loggedIn = true;

        localStorage.setItem('user', JSON.stringify(data.user));
        this.loggingIn = false;
        this.router.navigateByUrl(this.authService.redirectUrl);
      }

      //Returns to login and displays error message if any errors thrown from backend
      else {
        this.flashMessage.show(data.msg,
          {
            cssClass: 'alert-danger',
            timeout: 3000
          });
          this.loggingIn = false;
        this.router.navigate(['/']);
      }
    });
  }
}
