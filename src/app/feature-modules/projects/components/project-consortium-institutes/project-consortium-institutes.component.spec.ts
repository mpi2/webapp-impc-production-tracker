import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProjectConsortiumInstitutesComponent } from './project-consortium-institutes.component';

describe('ProjectConsortiumInstitutesComponent', () => {
  let component: ProjectConsortiumInstitutesComponent;
  let fixture: ComponentFixture<ProjectConsortiumInstitutesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectConsortiumInstitutesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectConsortiumInstitutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
