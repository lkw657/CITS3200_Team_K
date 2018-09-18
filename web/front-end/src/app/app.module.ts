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
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SubmissionComponent } from './components/submission/submission.component';
import { ReviewComponent } from './components/review/review.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { DynamicFormQuestionComponent } from './components/dynamic-form-question/dynamic-form-question.component';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';
import { EditUsersComponent } from './components/edit-users/edit-users.component';
import { EditQuestionsComponent } from './components/edit-questions/edit-questions.component';

//Services
import { ValidateService } from './services/validate.service';
import { DashboardService } from './services/dashboard.service';
import { AuthService } from './services/auth.service';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent},
  { path: 'submission', component: SubmissionComponent},
  { path: 'review', component: ReviewComponent},
  { path: 'editUsers', component: EditUsersComponent},
  { path: '**', component: NotFoundComponent}
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
    NotFoundComponent,
    DynamicFormQuestionComponent,
    DynamicFormComponent,
    EditUsersComponent,
    EditQuestionsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    FlashMessagesModule.forRoot(),
    ReactiveFormsModule,
  ],
  providers: [ValidateService],
  bootstrap: [AppComponent]
})
export class AppModule { }
