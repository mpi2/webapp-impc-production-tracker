import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IndexedLocationsComponent } from './indexed-locations.component';

describe('IndexedLocationsComponent', () => {
  let component: IndexedLocationsComponent;
  let fixture: ComponentFixture<IndexedLocationsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IndexedLocationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexedLocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
