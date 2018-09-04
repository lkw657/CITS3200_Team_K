import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidateService {

  constructor() { }

    //Ensure all required user fields are present
    validateRegister(user) {
      if (user.username == undefined || user.role == undefined || user.email == undefined || user.password == undefined) {
        return false;
      }
      else {
        return true;
      }
    }

   //Ensure email is valid
    validateEmail(email) {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test((email).toLowerCase());
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
    passwordComplex(email) {
      const complex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
      return complex.test((email));
    }

}
