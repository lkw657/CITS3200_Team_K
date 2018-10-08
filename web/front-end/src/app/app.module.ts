import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

//Components
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { SubmissionComponent } from './components/submission/submission.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { DynamicFormQuestionComponent } from './components/dynamic-form-question/dynamic-form-question.component';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';
import { EditUsersComponent } from './components/edit-users/edit-users.component';
import { EditQuestionsComponent } from './components/edit-questions/edit-questions.component';
import { VerifyComponent } from './components/verify/verify.component';
import { SubmissionsDashboardComponent } from './components/submissions-dashboard/submissions-dashboard.component';
import { ApprovalsDashboardComponent } from './components/approvals-dashboard/approvals-dashboard.component';

//Services
import { ValidateService } from './services/validate.service';
import { DashboardService } from './services/dashboard.service';
import { AuthService } from './services/auth.service';
import { QuestionService } from './services/question.service';

//Http interceptors
import { httpInterceptorProviders } from './http-interceptors/index';

//Guards
import { AuthGuard } from './guards/auth.guard';

import { DragulaModule } from 'ng2-dragula';



const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent, canActivate:[AuthGuard]},
  { path: 'submission', component: SubmissionComponent, canActivate:[AuthGuard]},
  { path: 'editUsers', component: EditUsersComponent, canActivate:[AuthGuard]},
  { path: 'editQuestions', component: EditQuestionsComponent, canActivate:[AuthGuard]},
  { path: 'verify/:mailID/:secret', component: VerifyComponent},
  { path: 'submissionsDashboard', component: SubmissionsDashboardComponent, canActivate:[AuthGuard]},
  { path: 'approvalsDashboard', component: ApprovalsDashboardComponent, canActivate:[AuthGuard]},
  { path: '**', component: NotFoundComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    SubmissionComponent,
    NotFoundComponent,
    DynamicFormQuestionComponent,
    DynamicFormComponent,
    EditUsersComponent,
    EditQuestionsComponent,
    VerifyComponent,
    SubmissionsDashboardComponent,
    ApprovalsDashboardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    FlashMessagesModule.forRoot(),
    ReactiveFormsModule,
    DragulaModule.forRoot()
  ],
  providers: [
    ValidateService,
    httpInterceptorProviders,
    QuestionService,
    DashboardService,
    AuthGuard,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
