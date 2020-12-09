import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PhenotypingAttemptComponent } from './phenotyping-attempt.component';

describe('PhenotypingAttemptComponent', () => {
  let component: PhenotypingAttemptComponent;
  let fixture: ComponentFixture<PhenotypingAttemptComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PhenotypingAttemptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhenotypingAttemptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
