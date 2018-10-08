import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    let secret = this.route.snapshot.paramMap.get('mailID');
    let mailID = this.route.snapshot.paramMap.get('secret');

    var user = this.authService.getProfile();
    console.log(user);
    if (user != null) {
      if(user.loggedIn){
        console.log("Logged In");
      } else {
        console.log("Not Logged In");
      }
    } else {
      console.log("User doesn't exist -- Redirecting to Login");

    }

  }

}
