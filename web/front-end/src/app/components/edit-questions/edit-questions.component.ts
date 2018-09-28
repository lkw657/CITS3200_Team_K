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
  currentQuestion: Object;

  // What should be displayed
  displayAll: boolean = true;
  displayEdit: boolean = false;
  displayDelete: boolean = false;

  ngOnInit() {
    // Get questions to show admin
    this.dashboardService.getAllQuestions().subscribe(res => {
      var questionSet = res['questionSet'];
      this.questionList = questionSet.questionList;

      //sort based on question order.
      console.log(this.questionList);
      this.questionList.sort(
        function (a, b) {
          var x = a.order;
          var y = b.order;
          return x - y;
        });
        console.log(this.questionList);
    },
      err => {
        console.log(err);
        return false;
      });
  }

  // This will hide all content besides the edit form.
  showEdit(question) {

    this.currentQuestion = question;
    this.displayDelete = false;
    this.displayAll = false;
    this.displayEdit = true;
    window.scrollTo(0, 0);
  }

  // This will hide all content besides the delete screen.
  showDelete(question) {

    this.currentQuestion = question;
    this.displayEdit = false;
    this.displayAll = false;
    this.displayDelete = true;
    window.scrollTo(0, 0);
  }

  // This will delete queation from current question set
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
    window.scrollTo(0, 0);
  }

  // Updates question in question list for submission
  onQuestionEdit(question) {
    this.displayAll = true;
    this.displayEdit = false;
    window.scrollTo(0, 0);
  }

  // Update Question set database through the backend
  saveNewQuestionSet() {
    for (let i = 0; i < this.questionList.length; i++) {
      this.questionList[i].order = i;
    }
    console.log(this.questionList);
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
