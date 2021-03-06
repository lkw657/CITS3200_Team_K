import { Component, OnInit } from '@angular/core';
import { ValidateService } from "../../services/validate.service";
import { AuthService } from "../../services/auth.service";
import { FlashMessagesService } from "angular2-flash-messages";
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

  fname: String;
  lname: String;
  number: String;
  email: String;
  password: String;
  password2: String;
  submitting = false;

  constructor(
    private validateService: ValidateService,
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService
  ) { }

  ngOnInit() {
  }

  onRegisterSubmit() {

    const user = {
      fname: this.fname,
      lname: this.lname,
      email: this.email,
      number: this.number,
      password: this.password,
      password2: this.password2
    }

    //Required Fields
    if (!this.validateService.validateRegister(user)) {
      window.scrollTo(0, 0);
      this.flashMessage.show('Please fill in all fields', { cssClass: 'align-bottom alert alert-danger', timeout: 3000 });
      return false;
    }

    //Ensure password complexity
    if (!this.validateService.passwordComplex(user.password)) {
      window.scrollTo(0, 0);
      this.flashMessage.show('Password must consist of at least 8 characters including an upper and lowercase letter and a number', { cssClass: 'align-top alert alert-danger', timeout: 5000 });
      return false;
    }

    //Ensure password match
    if (!this.validateService.passwordsMatch(user.password, user.password2)) {
      window.scrollTo(0, 0);
      this.flashMessage.show('Passwords do not match', { cssClass: 'align-top alert alert-danger', timeout: 5000 });
      return false;
    }

    this.submitting = true;
    //Register User
    this.authService.registerUser(user).subscribe(data => {
      if (data.success) {
        this.flashMessage.show(data.msg, { cssClass: 'align-top alert alert-success', timeout: 3000 });
        this.submitting = false;
        this.router.navigate(['/']);
      }
      else {
        this.flashMessage.show(data.msg, { cssClass: 'align-top alert alert-danger', timeout: 3000 });
        this.submitting = false;
        this.router.navigate(['/register']);
      }
    });
  }
}
