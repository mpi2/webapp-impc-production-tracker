import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationData } from '../model/conf/configuration-data';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationDataService {

  readonly CONFIGURATIONKEY = 'conf';

  constructor(private http: HttpClient) { }

  // Returns an object with configuration information: The available work units, work groups, priorities, plan types, etc.
  private getConfiguration() {
    return this.http.get<ConfigurationData>(`${environment.baseUrl}/api/conf`);
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
