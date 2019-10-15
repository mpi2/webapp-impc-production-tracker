import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntentionByLocationListComponent } from './intention-by-location-list.component';

describe('IntentionByLocationListComponent', () => {
  let component: IntentionByLocationListComponent;
  let fixture: ComponentFixture<IntentionByLocationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntentionByLocationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntentionByLocationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
