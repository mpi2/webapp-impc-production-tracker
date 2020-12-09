import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MutagenesisDonorsComponent } from './mutagenesis-donors.component';

describe('MutagenesisDonorsComponent', () => {
  let component: MutagenesisDonorsComponent;
  let fixture: ComponentFixture<MutagenesisDonorsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MutagenesisDonorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MutagenesisDonorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
