import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PhenotypingAttemptDetailsComponent } from './phenotyping-attempt-details.component';

describe('PhenotypingAttemptDetailsComponent', () => {
  let component: PhenotypingAttemptDetailsComponent;
  let fixture: ComponentFixture<PhenotypingAttemptDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PhenotypingAttemptDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhenotypingAttemptDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
