import { TestBed } from '@angular/core/testing';

import { FunderService } from './funder.service';

describe('FunderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FunderService = TestBed.inject(FunderService);
    expect(service).toBeTruthy();
  });
});
