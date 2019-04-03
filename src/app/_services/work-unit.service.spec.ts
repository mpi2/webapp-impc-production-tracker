import { TestBed } from '@angular/core/testing';

import { WorkUnitService } from './work-unit.service';

describe('WorkUnitService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WorkUnitService = TestBed.get(WorkUnitService);
    expect(service).toBeTruthy();
  });
});
