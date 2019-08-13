import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrisprAttemptComponent } from './crispr-attempt.component';

describe('CrisprAttemptComponent', () => {
  let component: CrisprAttemptComponent;
  let fixture: ComponentFixture<CrisprAttemptComponent>;

  beforeEach(async(() => {
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
