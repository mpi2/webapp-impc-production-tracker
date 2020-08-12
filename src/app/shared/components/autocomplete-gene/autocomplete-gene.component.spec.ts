import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompleteGeneComponent } from './autocomplete-gene.component';

describe('AutocompleteGeneComponent', () => {
  let component: AutocompleteGeneComponent;
  let fixture: ComponentFixture<AutocompleteGeneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutocompleteGeneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompleteGeneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
