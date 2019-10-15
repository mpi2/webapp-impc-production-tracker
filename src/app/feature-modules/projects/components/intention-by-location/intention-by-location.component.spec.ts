import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntentionByLocationComponent } from './intention-by-location.component';

describe('IntentionByLocationComponent', () => {
  let component: IntentionByLocationComponent;
  let fixture: ComponentFixture<IntentionByLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntentionByLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntentionByLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
