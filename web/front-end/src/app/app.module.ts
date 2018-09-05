import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';

//Components
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SubmissionComponent } from './components/submission/submission.component';
import { ReviewComponent } from './components/review/review.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

//Services
import { ValidateService } from './services/validate.service';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent/*, canActivate:[AuthGuard]*/ },
  { path: 'submission', component: SubmissionComponent/*, canActivate:[AuthGuard]*/},
  { path: 'review', component: ReviewComponent/*, canActivate:[AuthGuard]*/ },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    SubmissionComponent,
    ReviewComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    FlashMessagesModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('id_token');
        },
        whitelistedDomains: ['/']
      }
    })
  ],
  providers: [ValidateService],
  bootstrap: [AppComponent]
})
export class AppModule { }
