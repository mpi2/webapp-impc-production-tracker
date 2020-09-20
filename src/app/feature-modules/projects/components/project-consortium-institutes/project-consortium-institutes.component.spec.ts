import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectConsortiumInstitutesComponent } from './project-consortium-institutes.component';

describe('ProjectConsortiumInstitutesComponent', () => {
  let component: ProjectConsortiumInstitutesComponent;
  let fixture: ComponentFixture<ProjectConsortiumInstitutesComponent>;

  beforeEach(async(() => {
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
