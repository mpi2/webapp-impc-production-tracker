import { TestBed } from '@angular/core/testing';

import { AlleleTypeService } from './allele-type.service';

describe('AlleleTypeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AlleleTypeService = TestBed.get(AlleleTypeService);
    expect(service).toBeTruthy();
  });
});
