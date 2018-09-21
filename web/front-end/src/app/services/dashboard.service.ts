import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  user: any;

  constructor(
    private http: HttpClient
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
    return this.http.get<any>('http://localhost:3000/db/users');
  }

  //Update User in database
  updateUser(user) {
    return this.http.put<any>('http://localhost:3000/db/updateUser', user);
  }

  //Remove User in database
  removeUser(user) {
    return this.http.put<any>('http://localhost:3000/db/removeUser', user);
  }

  //Get ALL questions for IT to view
  getAllQuestions() {
    return this.http.get<any>('http://localhost:3000/db/questionSet/latest');
  }

  //Update Questions in database
  updateQuestionSet(questionList) {
    return this.http.post<any>('http://localhost:3000/db/questionSet', questionList);
  }
}
