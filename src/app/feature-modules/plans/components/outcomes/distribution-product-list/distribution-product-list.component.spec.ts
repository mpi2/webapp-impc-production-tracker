import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DistributionProductListComponent } from './distribution-product-list.component';

describe('DistributionProductListComponent', () => {
  let component: DistributionProductListComponent;
  let fixture: ComponentFixture<DistributionProductListComponent>;

  beforeEach(waitForAsync(() => {
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
