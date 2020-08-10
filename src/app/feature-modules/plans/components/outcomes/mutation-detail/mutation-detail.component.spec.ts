import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MutationDetailComponent } from './mutation-detail.component';

describe('MutationDetailComponent', () => {
  let component: MutationDetailComponent;
  let fixture: ComponentFixture<MutationDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MutationDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MutationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
