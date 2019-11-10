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

  updateListWithFile(consortiumName: string, file): Observable<GeneListRecord[]> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    const url = `${this.apiServiceUrl}/api/geneList/updateListWithFile/${consortiumName}`;
    return this.http.post<GeneListRecord[]>(url, formData);
  }

  uploadList(geneListRecords: GeneListRecord[], consortiumName: string): Observable<GeneListRecord[]> {
    const url = `${this.apiServiceUrl}/api/geneList/${consortiumName}/content`;
    return this.http.post<GeneListRecord[]>(url, geneListRecords);
  }
}
