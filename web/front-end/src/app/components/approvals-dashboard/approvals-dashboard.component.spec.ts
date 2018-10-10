import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalsDashboardComponent } from './approvals-dashboard.component';

describe('ApprovalssDashboardComponent', () => {
  let component: ApprovalsDashboardComponent;
  let fixture: ComponentFixture<ApprovalsDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovalsDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
