import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectIntentionComponent } from './project-intention.component';

describe('ProjectIntentionComponent', () => {
  let component: ProjectIntentionComponent;
  let fixture: ComponentFixture<ProjectIntentionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectIntentionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectIntentionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
