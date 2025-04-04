import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InsertionSequenceComponent } from './insertion-sequence.component';

describe('InsertionSequenceComponent', () => {
  let component: InsertionSequenceComponent;
  let fixture: ComponentFixture<InsertionSequenceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InsertionSequenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertionSequenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
