import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IndexedSequenceComponent } from './indexed-sequence.component';

describe('IndexedSequenceComponent', () => {
  let component: IndexedSequenceComponent;
  let fixture: ComponentFixture<IndexedSequenceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IndexedSequenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexedSequenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
