import { TestBed } from '@angular/core/testing';

import { ConfigAssetLoaderService } from './config-asset-loader.service';

describe('ConfigAssetLoaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConfigAssetLoaderService = TestBed.get(ConfigAssetLoaderService);
    expect(service).toBeTruthy();
  });
});
