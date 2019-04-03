import { TestBed } from '@angular/core/testing';

import { InstituteService } from './institute.service';

describe('InstituteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InstituteService = TestBed.get(InstituteService);
    expect(service).toBeTruthy();
  });
});
