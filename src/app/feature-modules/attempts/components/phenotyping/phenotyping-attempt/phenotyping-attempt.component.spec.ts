import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhenotypingAttemptComponent } from './phenotyping-attempt.component';

describe('PhenotypingAttemptComponent', () => {
  let component: PhenotypingAttemptComponent;
  let fixture: ComponentFixture<PhenotypingAttemptComponent>;

  beforeEach(async(() => {
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
