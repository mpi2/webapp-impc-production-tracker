import { TestBed } from '@angular/core/testing';

import { PriorityService } from './priority.service';

describe('PriorityService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PriorityService = TestBed.get(PriorityService);
    expect(service).toBeTruthy();
  });
});
