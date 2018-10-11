import { Component } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  @ViewChild(NavbarComponent)
  private status: NavbarComponent;

}
