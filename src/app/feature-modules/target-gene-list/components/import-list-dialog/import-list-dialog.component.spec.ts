import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportListDialogComponent } from './import-list-dialog.component';

describe('ImportListDialogComponent', () => {
  let component: ImportListDialogComponent;
  let fixture: ComponentFixture<ImportListDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportListDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
