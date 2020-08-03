import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributionProductListComponent } from './distribution-product-list.component';

describe('DistributionProductListComponent', () => {
  let component: DistributionProductListComponent;
  let fixture: ComponentFixture<DistributionProductListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistributionProductListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributionProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
