import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: String;
  password: String;

  constructor(
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
  }
}
