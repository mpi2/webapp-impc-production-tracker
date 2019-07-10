import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrisprAttemptDetailsComponent } from './crispr-attempt-details.component';

describe('CrisprAttemptDetailsComponent', () => {
  let component: CrisprAttemptDetailsComponent;
  let fixture: ComponentFixture<CrisprAttemptDetailsComponent>;

  beforeEach(async(() => {
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
