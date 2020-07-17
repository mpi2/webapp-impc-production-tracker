import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntentionListComponent } from './intention-list.component';

describe('IntentionListComponent', () => {
  let component: IntentionListComponent;
  let fixture: ComponentFixture<IntentionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntentionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntentionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
