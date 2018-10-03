import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    let secret = this.route.snapshot.paramMap.get('mailID');
    let mailID = this.route.snapshot.paramMap.get('secret');

    var user = JSON.parse(localStorage.getItem('user'));
    if (user == null) {
      console.log("User doesn't exist")
    }

  }

}
