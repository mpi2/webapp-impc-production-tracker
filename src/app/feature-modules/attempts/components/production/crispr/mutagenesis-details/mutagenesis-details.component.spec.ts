import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MutagenesisDetailsComponent } from './mutagenesis-details.component';

describe('MutagenesisDetailsComponent', () => {
  let component: MutagenesisDetailsComponent;
  let fixture: ComponentFixture<MutagenesisDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MutagenesisDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MutagenesisDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
