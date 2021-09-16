import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsCellAlleleModificationAttemptComponent } from './es-cell-allele-modification-attempt.component';

describe('esCellAlleleModificationComponent', () => {
  let component: EsCellAlleleModificationAttemptComponent;
  let fixture: ComponentFixture<EsCellAlleleModificationAttemptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsCellAlleleModificationAttemptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EsCellAlleleModificationAttemptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
