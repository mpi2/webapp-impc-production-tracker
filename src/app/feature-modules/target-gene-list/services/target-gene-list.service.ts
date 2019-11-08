import { Injectable } from '@angular/core';
import { ConfigAssetLoaderService } from 'src/app/core/services/config-asset-loader.service';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { GeneListRecord } from 'src/app/model/bio/target_gene_list/gene-list-record';

@Injectable({
  providedIn: 'root'
})
export class TargetGeneListService {
  private apiServiceUrl;

  constructor(private http: HttpClient, private configAssetLoaderService: ConfigAssetLoaderService) {
    this.configAssetLoaderService.getConfig().then(data => this.apiServiceUrl = data.appServerUrl);
  }

  getListByConsortium(pageNumber: number, consortiumName: string): Observable<GeneListRecord[]> {
    if (!consortiumName) {
      return of([]);
    }

    const url = `${this.apiServiceUrl}/api/geneList/${consortiumName}/content?page=${pageNumber}`;
    return this.http.get<GeneListRecord[]>(url);
  }
}
