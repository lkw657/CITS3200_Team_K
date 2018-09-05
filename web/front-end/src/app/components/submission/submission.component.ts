import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.css']
})
export class SubmissionComponent implements OnInit {

  constructor() { }

  question_set = {
    "version": "1",
    "questionList": [
      {"text" : "Purpose of funding?", "formName" : "RPF Central"},
      {"text" : "Total Cost of the Project:", "formName" : "RPF Central"},
      {"text" : "Total Amount of RPF Requested:", "formName" : "RPF Central"},
      {"text" : "Details of recurrent or operating costs of any equipment or facility:", "formName" : "RPF Central"},
      {"text" : "Details of how the operating costs of any equipment of facility will be funded in future years :", "formName" : "RPF Central"},
      {"text" : "Please address seperately each of the following criteria: Research Excellence, Alignment with Faculty and University Priorities, Leverage (at least 1:4), Impact and Collaboration", "formName" : "RPF Central"},
      {"text" : "Name of Applicant:", "formName" : "RPF Central"},
      {"text" : "BU to allocatte RF:", "formName" : "RPF Central"},
      {"text" : "Amount of Research Priorities Funding requested :", "formName" : "RPF Central"},
      {"text" : "Return on Investment ( External Funds to UWA )", "formName" : "RPF Central"},
      
      {"text" : "Provide a brief statement outlining how your proposal aligns with the Faculty's Strategic Vision", "formName" : "RPF EMS"},
      {"text" : "Provide a brief statement outlining how your proposal aligns with the Faculty's strategic research priorities or an emerging strategic research priority", "formName" : "RPF EMS"},
      {"text" : "Pleae provide a brief statement as to how this investment will return value to the Faculty", "formName" : "RPF EMS"},
      {"text" : "Please use this space to provide pertinent information that cannot fit elsewhere", "formName" : "RPF EMS"},      
    ]
  }

  ngOnInit() {
  }

}
