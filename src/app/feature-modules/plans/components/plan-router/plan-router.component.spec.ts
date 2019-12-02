import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanRouterComponent } from './plan-router.component';

describe('PlanRouterComponent', () => {
  let component: PlanRouterComponent;
  let fixture: ComponentFixture<PlanRouterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanRouterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanRouterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
