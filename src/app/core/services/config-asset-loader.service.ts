import { Injectable } from '@angular/core';
import { AssetConfiguration } from '../model/conf/asset-configuration';

@Injectable({
  providedIn: 'root'
})
export class ConfigAssetLoaderService {

  // eslint-disable-next-line @typescript-eslint/naming-convention
  private readonly CONFIG_URL = 'assets/config/config.json';
  private cachedResponse: AssetConfiguration = null;

  get baseUrl(): string {
    return this.cachedResponse.appServerUrl;
  }

  async getConfig() {
    if (!this.cachedResponse) {
      const response = await fetch(this.CONFIG_URL);
      const json = await response.json();
      this.cachedResponse = new AssetConfiguration(json);
    }
    return this.cachedResponse;
  }
}
