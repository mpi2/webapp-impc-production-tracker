import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssayComponent } from './assay.component';

describe('AssayComponent', () => {
  let component: AssayComponent;
  let fixture: ComponentFixture<AssayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
