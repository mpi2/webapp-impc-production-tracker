import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OutcomeListComponent } from './outcome-list.component';

describe('OutcomeListComponent', () => {
  let component: OutcomeListComponent;
  let fixture: ComponentFixture<OutcomeListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OutcomeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutcomeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
