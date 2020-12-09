import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReagentsComponent } from './reagents.component';

describe('ReagentsComponent', () => {
  let component: ReagentsComponent;
  let fixture: ComponentFixture<ReagentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReagentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReagentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
