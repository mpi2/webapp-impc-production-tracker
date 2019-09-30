import { Injectable } from '@angular/core';
import { AssetConfiguration } from '../model/conf/asset-configuration';

@Injectable({
  providedIn: 'root'
})
export class ConfigAssetLoaderService {

  private readonly CONFIG_URL = 'assets/config/config.json';
  private _cachedResponse: AssetConfiguration = null;

  async getConfig() {
    if (!this._cachedResponse) {
      const response = await fetch(this.CONFIG_URL);
      const json = await response.json();
      this._cachedResponse = new AssetConfiguration(json);
    }
    return this._cachedResponse;
  }
}
