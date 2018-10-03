import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { baseURI } from '../config';

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
    return this.http.post<any>(baseURI+'/register', user);
  }

  //Connects to back end to check username and password on login
  authenticateUser(user) {
    return this.http.post<any>(baseURI+'/authenticate', user);
  }

    //Connects to back end to check username and password on login
  logoutUser(user) {
    return this.http.post<any>(baseURI+'/logOut', user);
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
