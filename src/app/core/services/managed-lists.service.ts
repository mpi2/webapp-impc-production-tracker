import { Injectable } from '@angular/core';
import { ConfigAssetLoaderService } from 'src/app/core/services/config-asset-loader.service';
import { EntityValues } from '../../feature-modules/admin/model/entity-values';
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

  public getValuesByEntity(listsByUser, name: string) {
    let results: NamedValue[] = [];
    const entityValues: EntityValues = listsByUser.find(x => x.entityName === name);
    if (entityValues) {
      results = entityValues.values;
    }
    return results;
  }
}
