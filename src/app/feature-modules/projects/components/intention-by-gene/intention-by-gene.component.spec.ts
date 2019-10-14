import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntentionByGeneComponent } from './intention-by-gene.component';

describe('IntentionByGeneComponent', () => {
  let component: IntentionByGeneComponent;
  let fixture: ComponentFixture<IntentionByGeneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntentionByGeneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntentionByGeneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
