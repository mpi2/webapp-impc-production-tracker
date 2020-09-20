import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanCreationComponent } from './plan-creation.component';

describe('PlanCreationComponent', () => {
  let component: PlanCreationComponent;
  let fixture: ComponentFixture<PlanCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
