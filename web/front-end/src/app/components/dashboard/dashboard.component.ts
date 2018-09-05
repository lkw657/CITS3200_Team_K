import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  user = {
    "role": "student",
    "name": "James Bond",
    "email": "james.bond@student.uwa.edu.au",
    "number": "21728599",
    "password" : "92df2d6556fb2ac5689c4506f2b95532",
    "forms": [{
      "owner": "James Bond",
      "created_date": "10/08/2018",
      "status": "Approved",
      "comments": {
        "commenter": "Bruce Wayne",
        "comment": "Needs some more work - Dick was better."
      }
    },{
      "owner": "James Bond",
      "created_date": "15/08/2018",
      "status": "Awaiting HoS",
      "comments": {
        "commenter": "Clark Kent",
        "comment": "Needs some more work - Conner was better."
      }
    }],
  };

  ngOnInit() {
  }

}
