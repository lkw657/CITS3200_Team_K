import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidateService {

  constructor() { }

  //Ensure all required user fields are present
  validateRegister(user) {
    if (user.fname == undefined || user.lname == undefined || user.number == undefined || user.password == undefined) {
      return false;
    }
    else {
      return true;
    }
  }

  //Ensure passwords match
  passwordsMatch(password, password2) {
    if (password != password2) {
      return false;
    }
    else {
      return true;
    }
  }

  //Ensure password is more than 8 characters, has a capital and a number
  passwordComplex(password) {
    const complex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
    return complex.test((password));
  }

}
