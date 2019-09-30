import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ConfigAssetLoaderService} from './config-asset-loader.service';

@Injectable({
  providedIn: 'root'
})
export class FunderService {

  private apiServiceUrl;

  constructor(private http: HttpClient, private configAssetLoaderService: ConfigAssetLoaderService) {
    this.configAssetLoaderService.getConfig().then(data => this.apiServiceUrl = data.appServerUrl);
  }

  getAllFundersByWorkGroup(name: string) {
    return this.http.get<any[]>(this.apiServiceUrl + '/api/funders?workGroupName=' + name );
  }
}
