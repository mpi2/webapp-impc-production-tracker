import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EscellAttemptComponent } from './escell-attempt.component';

describe('EscellAttemptComponent', () => {
  let component: EscellAttemptComponent;
  let fixture: ComponentFixture<EscellAttemptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EscellAttemptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EscellAttemptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
