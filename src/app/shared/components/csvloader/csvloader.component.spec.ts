import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CSVLoaderComponent } from './csvloader.component';

describe('CSVLoaderComponent', () => {
  let component: CSVLoaderComponent;
  let fixture: ComponentFixture<CSVLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CSVLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CSVLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
