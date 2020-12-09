import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QcResultsComponent } from './qc-results.component';

describe('QcResultsComponent', () => {
  let component: QcResultsComponent;
  let fixture: ComponentFixture<QcResultsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QcResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QcResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
