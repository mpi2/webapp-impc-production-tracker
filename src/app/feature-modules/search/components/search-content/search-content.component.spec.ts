import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SearchContentComponent } from './search-content.component';

describe('SearchContentComponent', () => {
  let component: SearchContentComponent;
  let fixture: ComponentFixture<SearchContentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
