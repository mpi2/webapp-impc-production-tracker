import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrisprAlleleModificationAttemptComponent } from './crispr-allele-modification-attempt.component';

describe('crisprAlleleModificationComponent', () => {
  let component: CrisprAlleleModificationAttemptComponent;
  let fixture: ComponentFixture<CrisprAlleleModificationAttemptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrisprAlleleModificationAttemptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrisprAlleleModificationAttemptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
