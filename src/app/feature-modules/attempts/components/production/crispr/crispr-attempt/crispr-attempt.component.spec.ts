import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CrisprAttemptComponent } from './crispr-attempt.component';

describe('CrisprAttemptComponent', () => {
  let component: CrisprAttemptComponent;
  let fixture: ComponentFixture<CrisprAttemptComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CrisprAttemptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrisprAttemptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
