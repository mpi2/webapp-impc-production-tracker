import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SequenceIntentionDetailComponent } from './sequence-intention-detail.component';

describe('SequenceIntentionDetailComponent', () => {
  let component: SequenceIntentionDetailComponent;
  let fixture: ComponentFixture<SequenceIntentionDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SequenceIntentionDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SequenceIntentionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
