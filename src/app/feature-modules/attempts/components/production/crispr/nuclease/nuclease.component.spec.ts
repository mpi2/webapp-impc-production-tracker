import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NucleaseComponent } from './nuclease.component';

describe('NucleaseComponent', () => {
  let component: NucleaseComponent;
  let fixture: ComponentFixture<NucleaseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NucleaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NucleaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
