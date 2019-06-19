import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhenotypePlanDetailComponent } from './phenotype-plan-detail.component';

describe('PhenotypePlanDetailComponent', () => {
  let component: PhenotypePlanDetailComponent;
  let fixture: ComponentFixture<PhenotypePlanDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhenotypePlanDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhenotypePlanDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
