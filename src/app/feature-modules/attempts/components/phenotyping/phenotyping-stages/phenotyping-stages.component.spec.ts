import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhenotypingStagesComponent } from './phenotyping-stages.component';

describe('PhenotypingStagesComponent', () => {
  let component: PhenotypingStagesComponent;
  let fixture: ComponentFixture<PhenotypingStagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhenotypingStagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhenotypingStagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
