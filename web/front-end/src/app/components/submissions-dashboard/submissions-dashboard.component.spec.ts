import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionsDashboardComponent } from './submissions-dashboard.component';

describe('SubmissionsDashboardComponent', () => {
  let component: SubmissionsDashboardComponent;
  let fixture: ComponentFixture<SubmissionsDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmissionsDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmissionsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
