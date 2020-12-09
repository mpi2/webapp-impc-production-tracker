import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GenotypePrimersComponent } from './genotype-primers.component';

describe('GenotypePrimersComponent', () => {
  let component: GenotypePrimersComponent;
  let fixture: ComponentFixture<GenotypePrimersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GenotypePrimersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenotypePrimersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
