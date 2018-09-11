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
    const login = {
      number: this.number,
      password: this.password
    }

    //Authenticate user in backend
    this.authService.authenticateUser(login).subscribe(data => {

      //Renders dashboard if login is ok
      if(data.success){
        console.log(data);
        this.flashMessage.show(data.msg,
          {cssClass: 'alert-success',
          timeout:3000});
          data.user.loggedIn=true;
          if( data.user.role == "researcher" ){
            data.user.forms = [
              {created_date: "01/08/2018", status: "Approved", comments: { commenter: "James", comment: "Its too much money!!" }},
              {created_date: "01/08/2018", status: "Approved", comments: { commenter: "James", comment: "Its too much money!!" }},
              {created_date: "01/08/2018", status: "Approved", comments: { commenter: "James", comment: "Its too much money!!" }},
            ];
          } else if ( data.user.role == "staff" ){
            data.user.forms = [
              {created_date: "01/08/2018", owner: "Approved" },
              {created_date: "01/08/2018", owner: "Approved" },
              {created_date: "01/08/2018", owner: "Approved" },
            ];
          }

          localStorage.setItem('user', JSON.stringify(data.user));
          this.router.navigate(['/submission']);
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
