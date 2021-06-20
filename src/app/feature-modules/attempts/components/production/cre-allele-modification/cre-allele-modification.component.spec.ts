import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreAlleleModificationComponent } from './cre-allele-modification.component';

describe('CreAlleleModificationComponent', () => {
  let component: CreAlleleModificationComponent;
  let fixture: ComponentFixture<CreAlleleModificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreAlleleModificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreAlleleModificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
