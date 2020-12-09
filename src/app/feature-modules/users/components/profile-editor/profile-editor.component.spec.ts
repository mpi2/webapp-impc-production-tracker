import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProfileEditorComponent } from './profile-editor.component';

describe('ProfileEditorComponent', () => {
  let component: ProfileEditorComponent;
  let fixture: ComponentFixture<ProfileEditorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
