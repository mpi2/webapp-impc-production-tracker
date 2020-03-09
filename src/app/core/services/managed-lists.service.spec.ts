import { TestBed } from '@angular/core/testing';

import { ManagedListsService } from './managed-lists.service';

describe('ManagedListsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ManagedListsService = TestBed.inject(ManagedListsService);
    expect(service).toBeTruthy();
  });
});
