import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InsertionTargetedExonsComponent } from './insertion-targeted-exons.component';

describe('InsertionTargetedExonsComponent', () => {
  let component: InsertionTargetedExonsComponent;
  let fixture: ComponentFixture<InsertionTargetedExonsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InsertionTargetedExonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertionTargetedExonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
