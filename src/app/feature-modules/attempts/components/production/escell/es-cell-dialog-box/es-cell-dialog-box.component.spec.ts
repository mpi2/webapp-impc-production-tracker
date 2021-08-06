import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsCellDialogBoxComponent } from './es-cell-dialog-box.component';

describe('EsCellDialogBoxComponent', () => {
  let component: EsCellDialogBoxComponent;
  let fixture: ComponentFixture<EsCellDialogBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsCellDialogBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EsCellDialogBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
