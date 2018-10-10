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

  questionList: any;
  currentQuestion: any;

  // What should be displayed
  displayAll: boolean = true;
  displayEdit: boolean = false;
  displayDelete: boolean = false;
  displayNew: boolean = false;

  ngOnInit() {
    // Get questions to show admin
    this.dashboardService.getAllQuestions().subscribe(res => {
      var questionSet = res['questionSet'];
      this.questionList = questionSet.questionList;
    },
      err => {
        console.log(err);
        return false;
      });
  }

  // This will hide all content besides the edit form.
  showEdit(question) {

    this.currentQuestion = question;

    let type = this.currentQuestion.type.split("_")[0] + "_" + this.currentQuestion.type.split("_")[1];
    if(type=="money_array") {
      this.currentQuestion.array = this.currentQuestion.type.split("_")[2];
      this.currentQuestion.type = type;
    }
    this.displayAll = false;
    this.displayEdit = true;
    window.scrollTo(0, 0);
  }

  // This will hide all content besides the delete screen.
  showDelete(question) {

    this.currentQuestion = question;
    this.displayAll = false;
    this.displayDelete = true;
    window.scrollTo(0, 0);
  }

  // This will hide all content besides the delete screen.
  showNew() {
    
    // Creates blank question
    this.currentQuestion = {
      title: '',
      text: '',
      type: '',
      formName: '',
      order: this.questionList.length
    };

    this.displayAll = false;
    this.displayNew = true;
    window.scrollTo(0, 0);
  }

  // This will delete question from current question set
  deleteQuestion() {

    this.questionList.splice(this.questionList.indexOf(this.currentQuestion), 1);

    this.displayAll = true;
    this.displayDelete = false;
    window.scrollTo(0, 0);
  }

  // This will show all questions
  showAll() {
    this.displayAll = true;
    this.displayEdit = false;
    this.displayDelete = false;
    this.displayNew = false;
    window.scrollTo(0, 0);
  }

  // Adds question to question list for submission
  onQuestionNew() {
    this.displayAll = true;
    this.displayNew = false;

    // Add new question to questionList array
    this.questionList.push(this.currentQuestion);
    window.scrollTo(0, 0);
  }

  // Updates question in question list for submission
  onQuestionEdit() {
    this.displayAll = true;
    this.displayEdit = false;
    window.scrollTo(0, 0);
  }

  // Update Question set database through the backend
  saveNewQuestionSet() {
    for (let i = 0; i < this.questionList.length; i++) {
      this.questionList[i].order = i;
      if(this.questionList[i].array > 0) {
        this.questionList[i].type = this.questionList[i].type + "_" + this.questionList[i].array
        this.questionList[i].array = undefined
      }
    }

    this.dashboardService.updateQuestionSet(this.questionList).subscribe(data => {
      if (data.success) {
        this.flashMessage.show(data.msg, { cssClass: 'align-top alert alert-success', timeout: 3000 });
        this.router.navigate(['/home']);
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
