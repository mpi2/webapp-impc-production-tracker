import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DeletionCoordinatesComponent } from './deletion-coordinates.component';

describe('DeletionCoordinatesComponent', () => {
  let component: DeletionCoordinatesComponent;
  let fixture: ComponentFixture<DeletionCoordinatesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DeletionCoordinatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletionCoordinatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
