import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CrisprAttemptDetailsComponent } from './crispr-attempt-details.component';

describe('CrisprAttemptDetailsComponent', () => {
  let component: CrisprAttemptDetailsComponent;
  let fixture: ComponentFixture<CrisprAttemptDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CrisprAttemptDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrisprAttemptDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
