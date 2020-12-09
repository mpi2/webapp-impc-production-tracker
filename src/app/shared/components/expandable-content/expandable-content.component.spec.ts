import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExpandableContentComponent } from './expandable-content.component';

describe('ExpandableContentComponent', () => {
  let component: ExpandableContentComponent;
  let fixture: ComponentFixture<ExpandableContentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpandableContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpandableContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
