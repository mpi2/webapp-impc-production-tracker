import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntentionBySequenceComponent } from './intention-by-sequence.component';

describe('IntentionByLocationComponent', () => {
  let component: IntentionBySequenceComponent;
  let fixture: ComponentFixture<IntentionBySequenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntentionBySequenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntentionBySequenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
