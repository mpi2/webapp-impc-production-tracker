import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectEsCellQcComponent } from './project-es-cell-qc.component';

describe('ProjectEsCellQcComponent', () => {
  let component: ProjectEsCellQcComponent;
  let fixture: ComponentFixture<ProjectEsCellQcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectEsCellQcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectEsCellQcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
