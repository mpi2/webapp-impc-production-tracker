import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListControlsComponent } from './list-controls.component';

describe('ListControlsComponent', () => {
  let component: ListControlsComponent;
  let fixture: ComponentFixture<ListControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListControlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
