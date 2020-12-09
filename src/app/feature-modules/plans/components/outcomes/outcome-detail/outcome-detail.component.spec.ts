import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OutcomeDetailComponent } from './outcome-detail.component';

describe('OutcomeDetailComponent', () => {
  let component: OutcomeDetailComponent;
  let fixture: ComponentFixture<OutcomeDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OutcomeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutcomeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
