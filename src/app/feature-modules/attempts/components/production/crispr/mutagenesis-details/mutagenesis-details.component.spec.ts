import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MutagenesisDetailsComponent } from './mutagenesis-details.component';

describe('MutagenesisDetailsComponent', () => {
  let component: MutagenesisDetailsComponent;
  let fixture: ComponentFixture<MutagenesisDetailsComponent>;

  beforeEach(async(() => {
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
