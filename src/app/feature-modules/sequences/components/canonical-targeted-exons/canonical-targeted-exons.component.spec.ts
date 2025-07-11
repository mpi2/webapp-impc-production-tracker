import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CanonicalTargetedExonsComponent } from './canonical-targeted-exons.component';

describe('CanonicalTargetedExonsComponent', () => {
  let component: CanonicalTargetedExonsComponent;
  let fixture: ComponentFixture<CanonicalTargetedExonsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CanonicalTargetedExonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanonicalTargetedExonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
