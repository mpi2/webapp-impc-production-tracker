import { TestBed } from '@angular/core/testing';

import { ManagedListsService } from './managed-lists.service';

describe('ManagedListsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ManagedListsService = TestBed.get(ManagedListsService);
    expect(service).toBeTruthy();
  });
});
