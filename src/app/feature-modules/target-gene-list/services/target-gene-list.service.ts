import { Injectable } from '@angular/core';
import { ConfigAssetLoaderService } from 'src/app/core/services/config-asset-loader.service';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';
import { of, from } from 'rxjs';
import { GeneListRecord } from 'src/app/model/bio/target_gene_list/gene-list-record';
import { AssetConfiguration } from 'src/app/core/model/conf/asset-configuration';
import { flatMap } from 'rxjs/operators';
import { QueryBuilderService } from 'src/app/core';
import { Page } from 'src/app/model/page_structure/page';
import { GeneListDescription } from 'src/app/model/bio/target_gene_list/gene-list-description';

@Injectable({
  providedIn: 'root'
})
export class TargetGeneListService {
  private config$: Observable<AssetConfiguration>;

  constructor(
    private http: HttpClient,
    private configAssetLoaderService: ConfigAssetLoaderService,
    private queryBuilderService: QueryBuilderService) {
    this.config$ = from(this.configAssetLoaderService.getConfig());
  }

  getAllListsDescriptions() {
    return this.config$.pipe(flatMap(response => {
      const url = `${response.appServerUrl}/api/geneList/descriptions`;
      return this.http.get<GeneListDescription[]>(url);
    }));
  }

  getListByConsortium(page: Page, consortiumName: string, filterValues): Observable<GeneListRecord[]> {
    if (!consortiumName) {
      return of([]);
    }
    const queryParameters = this.queryBuilderService.buildQueryParameters(filterValues, page);
    return this.config$.pipe(flatMap(response => {
      const url = `${response.appServerUrl}/api/geneList/${consortiumName}/content?${queryParameters}`;
      return this.http.get<GeneListRecord[]>(url);
    }));
  }

  exportCsv(consortiumName: string, filterValues): Observable<any> {
    if (!consortiumName) {
      return of([]);
    }
    return this.config$.pipe(flatMap(response => {
      let url = `${response.appServerUrl}/api/geneList/${consortiumName}/export`;
      const filterParameters = this.queryBuilderService.buildQueryParameters(filterValues, null);

      if (filterParameters && filterParameters !== '') {
        url = url + '?' + filterParameters;
      }

      return this.http.get(url, { responseType: 'text' });
    }));
  }



  updateListWithFile(consortiumName: string, file): Observable<GeneListRecord[]> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.config$.pipe(flatMap(response => {
      const url = `${response.appServerUrl}/api/geneList/updateListWithFile/${consortiumName}`;
      return this.http.post<GeneListRecord[]>(url, formData);
    }));
  }

  uploadList(geneListRecords: GeneListRecord[], consortiumName: string): Observable<GeneListRecord[]> {
    return this.config$.pipe(flatMap(response => {
      const url = `${response.appServerUrl}/api/geneList/${consortiumName}/content`;
      return this.http.post<GeneListRecord[]>(url, geneListRecords);
    }));
  }

  deleteRecords(recordIds: number[], consortiumName: string) {
    return this.config$.pipe(flatMap(response => {
      const url = `${response.appServerUrl}/api/geneList/${consortiumName}/content?recordId=${recordIds}`;
      return this.http.delete(url);
    }));

  }
}
