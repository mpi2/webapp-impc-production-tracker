import { TestBed } from '@angular/core/testing';

import { ConsortiumService } from './consortium.service';

describe('ConsortiumService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConsortiumService = TestBed.get(ConsortiumService);
    expect(service).toBeTruthy();
  });
});
