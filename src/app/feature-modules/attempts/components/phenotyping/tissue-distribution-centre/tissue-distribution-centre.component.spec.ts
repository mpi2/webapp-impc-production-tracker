import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TissueDistributionCentreComponent } from './tissue-distribution-centre.component';

describe('TissueDistributionCentreComponent', () => {
  let component: TissueDistributionCentreComponent;
  let fixture: ComponentFixture<TissueDistributionCentreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TissueDistributionCentreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TissueDistributionCentreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
