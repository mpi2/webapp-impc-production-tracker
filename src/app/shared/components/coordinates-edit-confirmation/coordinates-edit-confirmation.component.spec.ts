import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CoordinatesEditConfirmationComponent } from './coordinates-edit-confirmation.component';

describe('CoordinatesEditConfirmationComponent', () => {
  let component: CoordinatesEditConfirmationComponent;
  let fixture: ComponentFixture<CoordinatesEditConfirmationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CoordinatesEditConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoordinatesEditConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
