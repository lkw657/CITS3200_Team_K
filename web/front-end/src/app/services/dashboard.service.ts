import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { baseURI } from '../config';

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
    return this.http.get<any>(baseURI + '/db/users');
  }

  //Get ALL emails for IT to view
  getAllEmails() {
    return this.http.get<any>(baseURI + '/email/list');
  }

  //Update User in database
  updateUser(user) {
    return this.http.put<any>(baseURI + '/db/updateUser', user);
  }

  //Update Email in database
  updateEmail(email) {
    return this.http.put<any>(baseURI + '/email/updateEmail', email);
  }

  // Add new email to DB
  newEmail(email) {
    return this.http.post<any>(baseURI + '/email/addEmail', email);
  }

  //Remove User in database
  removeUser(user) {
    return this.http.put<any>(baseURI + '/db/removeUser', user);
  }

  //Remove Email in database
  removeEmail(email) {
    return this.http.put<any>(baseURI + '/email/removeEmail', email);
  }

  //Get ALL questions for IT to view
  getAllQuestions() {
    return this.http.get<any>(baseURI + '/db/questionSet/latest');
  }

  //Get users submissions
  getUserSubmissions() {
    return this.http.get<any>(baseURI + '/submissions');
  }

  //Get forms awaiting approval by user
  getUserApprovals() {
    return this.http.get<any>(baseURI + '/approvals');
  }

  //Get forms history
  getFormHistory(history) {
    return this.http.post<any>(baseURI + '/formHistory', history);
  }

  //Update Questions in database
  updateQuestionSet(questionList) {
    return this.http.post<any>(baseURI + '/db/questionSet', questionList);
  }
}
