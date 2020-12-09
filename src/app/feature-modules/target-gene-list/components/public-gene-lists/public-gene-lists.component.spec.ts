import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PublicGeneListsComponent } from './public-gene-lists.component';

describe('PublicGeneListsComponent', () => {
  let component: PublicGeneListsComponent;
  let fixture: ComponentFixture<PublicGeneListsComponent>;

  beforeEach(waitForAsync(() => {
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
