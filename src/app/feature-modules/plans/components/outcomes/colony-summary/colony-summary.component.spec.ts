import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColonySummaryComponent } from './colony-summary.component';

describe('ColonySummaryComponent', () => {
  let component: ColonySummaryComponent;
  let fixture: ComponentFixture<ColonySummaryComponent>;

  beforeEach(async(() => {
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
