import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LargeTableContentComponent } from './large-table-content.component';

describe('LargeTableContentComponent', () => {
  let component: LargeTableContentComponent;
  let fixture: ComponentFixture<LargeTableContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LargeTableContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LargeTableContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
