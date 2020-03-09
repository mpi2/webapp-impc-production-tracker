import { TestBed } from '@angular/core/testing';

import { PlanService } from './plan.service';

describe('PlanService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlanService = TestBed.inject(PlanService);
    expect(service).toBeTruthy();
  });
});
