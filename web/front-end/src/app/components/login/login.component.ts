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
  number: String;
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
      number: this.number,
      password: this.password
    }

    //Authenticate user in backend
    this.authService.authenticateUser(user).subscribe(data => {

      //Renders dashboard if login is ok
      if(data.success){
        this.flashMessage.show(data.msg, 
          {cssClass: 'alert-success', 
          timeout:3000});
          //SHOULD WE RECEIVE USER IN DATA AND STORE IN LOCAL STORAGE HERE? 
          this.router.navigate(['/dashboard']);
      }

      //Returns to login and displays error message if any errors thrown from backend
      else{
        this.flashMessage.show(data.msg, 
          {cssClass: 'alert-danger', 
          timeout:3000});
          this.router.navigate(['/']);
      }
    });
  }
}
