import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhenotypingPlanComponent } from './phenotyping-plan.component';

describe('PhenotypingPlanComponent', () => {
  let component: PhenotypingPlanComponent;
  let fixture: ComponentFixture<PhenotypingPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhenotypingPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhenotypingPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
