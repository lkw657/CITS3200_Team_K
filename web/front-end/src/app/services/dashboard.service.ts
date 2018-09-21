import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  user: any;

  constructor(
    private http: Http
  ) { }

  // Gets user details from local storage
  getProfile() {
    var user = JSON.parse(localStorage.getItem('user'));
    if (user == null) {
      user = { loggedIn: false };
    }
    return user;
  }

  //Get ALL users for IT to view
  getAllUsers() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:3000/db/users', { headers: headers, withCredentials: true})
      .pipe(map(res => res.json()));
  }

  //Update User in database
  updateUser(user) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put('http://localhost:3000/db/updateUser', user, { headers: headers, withCredentials: true })
      .pipe(map(res => res.json()));
  }

  //Remove User in database
  removeUser(user) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put('http://localhost:3000/db/removeUser', user, { headers: headers, withCredentials: true })
      .pipe(map(res => res.json()));
  }

  //Get ALL questions for IT to view
  getAllQuestions() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:3000/db/questionSet/latest', { headers: headers, withCredentials: true })
      .pipe(map(res => res.json()));
  }

  //Update Questions in database
  updateQuestionSet(questionList) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/db/questionSet', questionList, { headers: headers, withCredentials: true })
      .pipe(map(res => res.json()));
  }
}
