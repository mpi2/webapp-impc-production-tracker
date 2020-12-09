import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StatusTransitionComponent } from './status-transition.component';

describe('StatusTransitionComponent', () => {
  let component: StatusTransitionComponent;
  let fixture: ComponentFixture<StatusTransitionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StatusTransitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusTransitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
