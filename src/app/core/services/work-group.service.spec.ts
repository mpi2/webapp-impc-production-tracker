import { TestBed } from '@angular/core/testing';

import { WorkGroupService } from './work-group.service';

describe('WorkGroupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WorkGroupService = TestBed.inject(WorkGroupService);
    expect(service).toBeTruthy();
  });
});
