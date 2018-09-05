import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthService } from '../../services/auth.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: String;
  password: String;

  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService
  ) { }

  ngOnInit() {
  }

  //Submit button sends user info to backend for authentication
  onLoginSubmit() {
    const user = {
      username: this.username,
      password: this.password
    }

    this.authService.authenticateUser(user).subscribe(data => {
      if(data.success){
        this.authService.storeUserData(data.token, data.user);
        this.flashMessage.show(data.msg, 
          {cssClass: 'alert-success', 
          timeout:3000});
          this.router.navigate(['/dashboard']);
      }
      else{
        this.flashMessage.show(data.msg, 
          {cssClass: 'alert-danger', 
          timeout:3000});
          this.router.navigate(['/']);
      }
    });
  }
}
