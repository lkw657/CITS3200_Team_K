import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class DashboardServices {
  user: any;

  constructor(
    private http: Http
  ) { }

  getProfile(){
    var user = JSON.parse(localStorage.getItem('user'));
    if(user==null){
      user = {loggedIn:false};
    }
    return user;
  }
}
