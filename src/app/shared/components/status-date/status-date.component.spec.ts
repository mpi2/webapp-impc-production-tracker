import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StatusDateComponent } from './status-date.component';

describe('StatusDateComponent', () => {
  let component: StatusDateComponent;
  let fixture: ComponentFixture<StatusDateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StatusDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
