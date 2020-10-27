import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicGeneListsComponent } from './public-gene-lists.component';

describe('PublicGeneListsComponent', () => {
  let component: PublicGeneListsComponent;
  let fixture: ComponentFixture<PublicGeneListsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicGeneListsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicGeneListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
