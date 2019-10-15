import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntentionByGeneListComponent } from './intention-by-gene-list.component';

describe('IntentionByGeneListComponent', () => {
  let component: IntentionByGeneListComponent;
  let fixture: ComponentFixture<IntentionByGeneListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntentionByGeneListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntentionByGeneListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
