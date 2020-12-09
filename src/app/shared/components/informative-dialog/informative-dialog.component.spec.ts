import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InformativeDialogComponent } from './informative-dialog.component';

describe('InformativeDialogComponent', () => {
  let component: InformativeDialogComponent;
  let fixture: ComponentFixture<InformativeDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InformativeDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformativeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
