import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PhenotypingStageDetailsComponent } from './phenotyping-stage-details.component';

describe('PhenotypingStageDetailsComponent', () => {
  let component: PhenotypingStageDetailsComponent;
  let fixture: ComponentFixture<PhenotypingStageDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PhenotypingStageDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhenotypingStageDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
