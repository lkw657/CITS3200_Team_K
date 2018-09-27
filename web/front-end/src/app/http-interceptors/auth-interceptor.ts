import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { finalize, tap } from 'rxjs/operators';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from "@angular/router";

import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	constructor(private auth: AuthService,
                private router: Router,
                private flashMessage: FlashMessagesService) {}
 
	intercept(req: HttpRequest<any>, next: HttpHandler) {
        // Modify the request to send the cookie
        const newReq = req.clone({withCredentials: true})
        // Check the response
        return next.handle(newReq).pipe(tap((event: HttpEvent<any>) => {
        }, (err: any) => {
            if (err instanceof HttpErrorResponse) {
                if (err.status === 401) {
                    // Cookie was bad, or other reason why backend doesn't like user's login
                    console.log('Not logged in')
                    this.flashMessage.show('Please log in',
                        {cssClass: 'alert-danger',
                        timeout:3000});
                    this.router.navigate(['/']);
                }
                else if (err.status === 403) {
                    // Invalid permissions
                    console.log('Access denied')
                    this.flashMessage.show('You do not have permission to access this page',
                        {cssClass: 'alert-danger',
                        timeout:3000});
                    this.router.navigate(['/dashboard']);
                }
            }
        }));
    }
}
