import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: any;

  constructor(
    private http: HttpClient
  ) { }

  //Connects to back end to add new user to db
  registerUser(user) { 
    return this.http.post<any>('http://localhost:3000/register', user);
  }

  //Connects to back end to check username and password on login
  authenticateUser(user) {
    return this.http.post<any>('http://localhost:3000/authenticate', user);
  }

  // Gets user details from local storage
  getProfile(){
    var user = JSON.parse(localStorage.getItem('user'));
    if(user==null){
      user = {loggedIn:false};
    }
    return user;
  }
}

