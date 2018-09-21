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
    return this.http.post('http://localhost:3000/register', user, { headers: headers})
      .pipe(map(res => res.json()));
  }

  //Connects to back end to check username and password on login
  authenticateUser(user) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/authenticate', user, { headers: headers, withCredentials: true})
      .pipe(map(res => res.json()));
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

