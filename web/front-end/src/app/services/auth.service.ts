import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: any;

  constructor(
    private http: Http
  ) { }

  //Connects to back end to add new user to db
  registerUser(user) { 
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/db/register', user, { headers: headers })
      .pipe(map(res => res.json()));
  }

  //Connects to back end to check username and password on login - SHOULD THIS BE A GET?
  authenticateUser(user) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/db/authenticate', user, { headers: headers })
      .pipe(map(res => res.json()));
  }

  getProfile(){
    const user = {
      //These will be stored in localStorage on login and accessed by navbar
      fname:'David',
      lname:'Weight',
      role:'staff'
    }
    return user;

    //This function can retrieve text from local storage
    // if (localStorage.getItem('user')){
    //   return JSON.parse(localStorage.getItem('user')).username;
    // }
    // else{
    //   return "";
    // }
  }
  
  //Stores username in local storage for display - STORE OTHER DETAILS AS WELL!
  storeUserData(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }
}

