import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhenotypingStageDetailsComponent } from './phenotyping-stage-details.component';

describe('PhenotypingStageDetailsComponent', () => {
  let component: PhenotypingStageDetailsComponent;
  let fixture: ComponentFixture<PhenotypingStageDetailsComponent>;

  beforeEach(async(() => {
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
