import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AutocompleteGeneInputsComponent } from './autocomplete-gene-inputs.component';

describe('AutocompleteGeneInputsComponent', () => {
  let component: AutocompleteGeneInputsComponent;
  let fixture: ComponentFixture<AutocompleteGeneInputsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AutocompleteGeneInputsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompleteGeneInputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
