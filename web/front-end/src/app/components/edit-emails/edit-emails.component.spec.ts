import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEmailsComponent } from './edit-emails.component';

describe('EditEmailsComponent', () => {
  let component: EditEmailsComponent;
  let fixture: ComponentFixture<EditEmailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditEmailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEmailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
