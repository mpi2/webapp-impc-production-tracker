import { Injectable } from '@angular/core';
import { ConfigAssetLoaderService } from 'src/app/core/services/config-asset-loader.service';
import { Observable } from 'rxjs/internal/Observable';
import { ConsortiumList } from 'src/app/model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TargetGeneListService {
  private apiServiceUrl;

  constructor(private http: HttpClient, private configAssetLoaderService: ConfigAssetLoaderService) {
    this.configAssetLoaderService.getConfig().then(data => this.apiServiceUrl = data.appServerUrl);
  }

  getAll(): Observable<ConsortiumList[]> {
    return this.http.get<ConsortiumList[]>(this.apiServiceUrl + '/api/targetGeneList');
  }
}
