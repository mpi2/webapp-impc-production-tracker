import { Injectable } from '@angular/core';
import { ConfigAssetLoaderService } from 'src/app/core/services/config-asset-loader.service';
import { EntityValues } from '../admin/model/entity-values';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ManagedListsService {

  private apiServiceUrl;

  constructor(private http: HttpClient, private configAssetLoaderService: ConfigAssetLoaderService) {
    this.configAssetLoaderService.getConfig().then(data => this.apiServiceUrl = data.appServerUrl);
  }

  public getManagedListsByUser() {
    return this.http.get<EntityValues[]>(this.apiServiceUrl + '/api/listsByManagerUser');
  }
}
