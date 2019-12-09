import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsortiumSelectorComponent } from './consortium-selector.component';

describe('ConsortiumSelectorComponent', () => {
  let component: ConsortiumSelectorComponent;
  let fixture: ComponentFixture<ConsortiumSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsortiumSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsortiumSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
