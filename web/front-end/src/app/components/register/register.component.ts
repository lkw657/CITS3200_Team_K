import { Component, OnInit } from '@angular/core';
import { ValidateService } from "../../services/validate.service";
import { FlashMessagesService } from "angular2-flash-messages";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  username: String;
  role: String;
  email: String;
  password: String;
  password2: String;

  constructor(
    private validateService: ValidateService,
    private flashMessage: FlashMessagesService
  ) { }

  ngOnInit() {
  }

  onRegisterSubmit() {
    const user = {
      username: this.username,
      role: this.role,
      email: this.email,
      password: this.password,
      password2: this.password2
    }
    //Required Fields
    if (!this.validateService.validateRegister(user)) {
      this.flashMessage.show('Please fill in all fields', { cssClass: 'align-bottom alert alert-danger', timeout: 3000 });
      return false;
    }

    //Validate Email
    if (!this.validateService.validateEmail(user.email)) {
      this.flashMessage.show('Please enter a valid email', { cssClass: 'align-top alert alert-danger', timeout: 3000 });
      return false;
    }

    //Ensure password complexity
    if (!this.validateService.passwordComplex(user.password)) {
      this.flashMessage.show('Password must consist of at least 8 characters including an upper and lowercase letter and a number', { cssClass: 'align-top alert alert-danger', timeout: 5000 });
      return false;
    }

    //Ensure password match
    if (!this.validateService.passwordsMatch(user.password, user.password2)) {
      this.flashMessage.show('Passwords do not match', { cssClass: 'align-top alert alert-danger', timeout: 5000 });
      return false;
    }
  }

}
