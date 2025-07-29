import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InsertionCanonicalTargetedExonsComponent } from './insertion-canonical-targeted-exons.component';

describe('InsertionCanonicalTargetedExonsComponent', () => {
  let component: InsertionCanonicalTargetedExonsComponent;
  let fixture: ComponentFixture<InsertionCanonicalTargetedExonsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InsertionCanonicalTargetedExonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertionCanonicalTargetedExonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
