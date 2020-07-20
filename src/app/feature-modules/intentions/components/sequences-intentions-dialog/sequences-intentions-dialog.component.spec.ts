import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SequencesIntentionsDialogComponent } from './sequences-intentions-dialog.component';

describe('SequencesIntentionsDialogComponent', () => {
  let component: SequencesIntentionsDialogComponent;
  let fixture: ComponentFixture<SequencesIntentionsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SequencesIntentionsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SequencesIntentionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
