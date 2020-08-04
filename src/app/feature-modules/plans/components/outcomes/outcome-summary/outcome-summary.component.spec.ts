import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutcomeSummaryComponent } from './outcome-summary.component';

describe('OutcomeDetailComponent', () => {
  let component: OutcomeSummaryComponent;
  let fixture: ComponentFixture<OutcomeSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutcomeSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutcomeSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
