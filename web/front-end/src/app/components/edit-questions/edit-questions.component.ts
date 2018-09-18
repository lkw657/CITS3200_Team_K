import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from "angular2-flash-messages";
import { Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-edit-questions',
  templateUrl: './edit-questions.component.html',
  styleUrls: ['./edit-questions.component.css']
})
export class EditQuestionsComponent implements OnInit {

  constructor(
    private router: Router,
    private flashMessage: FlashMessagesService,
    private dashboardService: DashboardService
  ) { }

  questionList: Object;
  currentQuestion: Object;

  //What should be displayed
  displayAll: boolean = true;
  displayEdit: boolean = false;

  ngOnInit() {
    //Get users to show admin
    this.dashboardService.getAllQuestions().subscribe(questionSet => {
      this.questionList = questionSet.questionList;
    },
      err => {
        console.log(err);
        return false;
      });
  }

  //This will hide all content besides the edit form.
  showEdit(question) {
    this.currentQuestion = question;
    this.displayAll = false;
    this.displayEdit = true;
    window.scrollTo(0, 0);
  }

  //This will show all questions
  showAll() {
    this.displayAll = true;
    this.displayEdit = false;
    window.scrollTo(0, 0);
  }

  onQuestionEdit(question) {
    this.displayAll = true;
    this.displayEdit = false;
    window.scrollTo(0, 0);
  }
  //Update Question set database through the backend
  saveNewQuestionSet() {
    this.dashboardService.updateQuestionSet(this.questionList).subscribe(data => {
      if (data.success) {
        this.flashMessage.show(data.msg, { cssClass: 'align-top alert alert-success', timeout: 3000 });
        this.router.navigate(['/dashboard']);
      }
      else {
        this.flashMessage.show(data.msg, { cssClass: 'align-top alert alert-danger', timeout: 5000 });
        this.router.navigate(['/editQuestions']);
      }
    });
    this.displayAll = true;
    this.displayEdit = false;
    window.scrollTo(0, 0);
  }
}
