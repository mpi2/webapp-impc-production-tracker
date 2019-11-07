import { Injectable } from '@angular/core';
import { ConfigAssetLoaderService } from 'src/app/core/services/config-asset-loader.service';
import { Observable } from 'rxjs/internal/Observable';
import { ConsortiumList } from 'src/app/model';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TargetGeneListService {
  private apiServiceUrl;

  constructor(private http: HttpClient, private configAssetLoaderService: ConfigAssetLoaderService) {
    this.configAssetLoaderService.getConfig().then(data => this.apiServiceUrl = data.appServerUrl);
  }

  getListByConsortium(pageNumber: number, consortiumName: string): Observable<ConsortiumList[]> {
    if (!consortiumName) {
      return of([]);
    }
    const pageParameter = '?page=' + pageNumber;
    const url = this.apiServiceUrl + '/api/targetGeneList/' + consortiumName + pageParameter;
    return this.http.get<ConsortiumList[]>(url);
  }
}
