import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectListContentComponent } from './project-list-content.component';

describe('ProjectListContentComponent', () => {
  let component: ProjectListContentComponent;
  let fixture: ComponentFixture<ProjectListContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectListContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectListContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
