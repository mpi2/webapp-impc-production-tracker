import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhenotypePlansComponent } from './phenotype-plans.component';

describe('PhenotypePlansComponent', () => {
  let component: PhenotypePlansComponent;
  let fixture: ComponentFixture<PhenotypePlansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhenotypePlansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhenotypePlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
