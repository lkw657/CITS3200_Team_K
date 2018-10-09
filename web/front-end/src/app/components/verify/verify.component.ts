import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
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
    private router: Router,
    private http: HttpClient
  ) { }

  secret : string = '';
  mailID : string = '';

  onAccept(){
    this.http.post(baseURI + '/mail/verifyFormAccess', {'mailID': this.mailID, 'secret': this.secret}).subscribe(
      (data) => {
        console.log(data)
        this.router.navigate(['/home']);},
      (err) => console.log(err)
    );
  }

  onReject(){
    console.log("Rejected!!");
  }

  ngOnInit() {
    this.mailID = this.route.snapshot.paramMap.get('mailID');
    this.secret = this.route.snapshot.paramMap.get('secret');
  }
}
