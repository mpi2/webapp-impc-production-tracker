import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationData } from '../model/conf/configuration-data';
import {ConfigAssetLoaderService} from './config-asset-loader.service';
import { Observable, of, ReplaySubject } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationDataService {

  private dataSubject = new ReplaySubject<ConfigurationData>(1);
  data$: Observable<ConfigurationData> = this.dataSubject.asObservable();
  private cache$: Observable<ConfigurationData>;

  private apiServiceUrl;
  readonly CONFIGURATIONKEY = 'conf';

  constructor(private http: HttpClient, private configAssetLoaderService: ConfigAssetLoaderService) {
    this.configAssetLoaderService.loadConfigurations().subscribe(data => this.apiServiceUrl = data.appServerUrl);
  }

  public getConfigurationData() {
    if (!this.cache$) {
      this.cache$ = this.fetchConf().pipe(
        shareReplay(1)
      );
    }
    return this.cache$;
  }

  private fetchConf() {
    console.warn('@@@fetchConf>>');
    
    return this.http.get<ConfigurationData>(this.apiServiceUrl + '/api/conf');
  }

  writeConfiguration() {
    // console.log('called writeConfiguration');
    
    // this.getConfiguration().subscribe(data => {
    //   if (data) {
    //     sessionStorage.setItem(this.CONFIGURATIONKEY, JSON.stringify(data));
    //   }
    // });
  }

  getConfigurationInfo(): ConfigurationData {
    const configurationData: ConfigurationData = JSON.parse(sessionStorage.getItem(this.CONFIGURATIONKEY));
    return configurationData;
  }

  // fetchConfigurationData() {
  //   console.log('called fetchConfigurationData');
    
  //   this.getConfiguration().subscribe(res => {this.dataSubject.next(res)});
  // }
}
