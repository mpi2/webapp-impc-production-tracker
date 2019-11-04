import { TestBed } from '@angular/core/testing';

import { TargetGeneListService } from './target-gene-list.service';

describe('TargetGeneListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TargetGeneListService = TestBed.get(TargetGeneListService);
    expect(service).toBeTruthy();
  });
});
