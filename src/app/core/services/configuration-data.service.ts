import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationData } from '../model/conf/configuration-data';
import { environment } from 'src/environments/environment';
import {ConfigAssetLoaderService} from './config-asset-loader.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationDataService {

  private url;

  readonly CONFIGURATIONKEY = 'conf';

  constructor(private http: HttpClient, private configAssetLoaderService: ConfigAssetLoaderService) {
    this.configAssetLoaderService.loadConfigurations().subscribe(data => this.url = data.appServerUrl);
  }

  // Returns an object with configuration information: The available work units, work groups, priorities, plan types, etc.
  private getConfiguration() {
    return this.http.get<ConfigurationData>(this.url + '/api/conf');
  }

  writeConfiguration() {
    this.getConfiguration().subscribe(data => {
      if (data) {
        localStorage.setItem(this.CONFIGURATIONKEY, JSON.stringify(data));
      }
    });
  }

  getConfigurationInfo(): ConfigurationData {
    const configurationData: ConfigurationData = JSON.parse(localStorage.getItem(this.CONFIGURATIONKEY));
    return configurationData;
  }
}
