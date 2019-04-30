import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionPlansComponent } from './production-plans.component';

describe('ProductionPlansComponent', () => {
  let component: ProductionPlansComponent;
  let fixture: ComponentFixture<ProductionPlansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductionPlansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
