import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ColonySummaryComponent } from './colony-summary.component';

describe('ColonySummaryComponent', () => {
  let component: ColonySummaryComponent;
  let fixture: ComponentFixture<ColonySummaryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ColonySummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColonySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
