import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Http } from '@angular/http';
import { baseURI } from '../../config';


@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private http: Http
  ) { }

  secret : string = '';
  mailID : string = '';

  onAccept(){
    this.http.post(baseURI + '/mail/verifyFormAccess', {'mailID': this.mailID, 'secret': this.secret}).subscribe(
      (data) => {console.log(data)},
      (err) => console.log(err)
    );
  }

  onReject(){
    console.log("Rejected!!");
  }

  ngOnInit() {
    this.secret = this.route.snapshot.paramMap.get('mailID');
    this.mailID = this.route.snapshot.paramMap.get('secret');
  }
}
