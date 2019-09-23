import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {ConfigAssetLoaderService} from './config-asset-loader.service';

@Injectable({
  providedIn: 'root'
})
export class FunderService {

  private url;

  constructor(private http: HttpClient, private configAssetLoaderService: ConfigAssetLoaderService) {
    this.configAssetLoaderService.loadConfigurations().subscribe(data => this.url = data.appServerUrl);
  }

  getAllFundersByWorkGroup(name: string) {
    return this.http.get<any[]>(this.url + '/api/funders?workGroupName=' + name );
  }
}
