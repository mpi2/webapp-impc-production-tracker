import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ColonyDetailComponent } from './colony-detail.component';

describe('ColonyDetailComponent', () => {
  let component: ColonyDetailComponent;
  let fixture: ComponentFixture<ColonyDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ColonyDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColonyDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
