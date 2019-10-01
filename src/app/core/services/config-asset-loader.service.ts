import { Injectable } from '@angular/core';
import { AssetConfiguration } from '../model/conf/asset-configuration';

@Injectable({
  providedIn: 'root'
})
export class ConfigAssetLoaderService {

  private readonly CONFIG_URL = 'assets/config/config.json';
  private cachedResponse: AssetConfiguration = null;

  async getConfig() {
    if (!this.cachedResponse) {
      const response = await fetch(this.CONFIG_URL);
      const json = await response.json();
      this.cachedResponse = new AssetConfiguration(json);
    }
    return this.cachedResponse;
  }
}
