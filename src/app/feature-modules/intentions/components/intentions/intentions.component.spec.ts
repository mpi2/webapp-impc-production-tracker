import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntentionsComponent } from './intentions.component';

describe('IntentionsComponent', () => {
  let component: IntentionsComponent;
  let fixture: ComponentFixture<IntentionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntentionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntentionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
