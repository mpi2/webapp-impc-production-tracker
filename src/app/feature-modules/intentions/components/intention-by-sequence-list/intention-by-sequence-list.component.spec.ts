import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntentionBySequenceListComponent } from './intention-by-sequence-list.component';

describe('IntentionBySequenceListComponent', () => {
  let component: IntentionBySequenceListComponent;
  let fixture: ComponentFixture<IntentionBySequenceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntentionBySequenceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntentionBySequenceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
