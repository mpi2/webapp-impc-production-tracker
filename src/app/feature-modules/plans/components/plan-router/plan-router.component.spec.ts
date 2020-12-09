import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PlanRouterComponent } from './plan-router.component';

describe('PlanRouterComponent', () => {
  let component: PlanRouterComponent;
  let fixture: ComponentFixture<PlanRouterComponent>;

  beforeEach(waitForAsync(() => {
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
