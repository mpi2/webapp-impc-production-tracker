import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TargetedExonsComponent } from './targeted-exons.component';

describe('TargetedExonsComponent', () => {
  let component: TargetedExonsComponent;
  let fixture: ComponentFixture<TargetedExonsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TargetedExonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetedExonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
