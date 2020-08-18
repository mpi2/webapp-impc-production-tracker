import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexedSequenceComponent } from './indexed-sequence.component';

describe('IndexedSequenceComponent', () => {
  let component: IndexedSequenceComponent;
  let fixture: ComponentFixture<IndexedSequenceComponent>;

  beforeEach(async(() => {
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
