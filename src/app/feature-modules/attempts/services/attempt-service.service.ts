import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrisprAttempt } from '../model/production/crispr/crispr-attempt';
import { ConfigAssetLoaderService } from '../../../core/services/config-asset-loader.service';
import { Exon } from '../model/production/crispr/exon';
import { ESCellData } from '../components/production/escell/es-cell-dialog-box/es-cell-dialog-box.component';

@Injectable({
  providedIn: 'root'
})
export class AttemptServiceService {

  private apiServiceUrl;

  constructor(private http: HttpClient, private configAssetLoaderService: ConfigAssetLoaderService) {
    this.configAssetLoaderService.getConfig().then(data => this.apiServiceUrl = data.appServerUrl);
  }

  /**
   * Gets an attempt using a provided url.
   *
   * @param url Url to get the attempt.
   */
  getAttemptByUrl(url: string) {
    return this.http.get<CrisprAttempt>(url);
  }

  getExonsFromWge(gene: string) {
    return this.http.get<Exon[]>(this.apiServiceUrl + '/api/plans/exons_from_wge/' + gene);
  }

  getEsCellsByGeneSymbol(geneSymbol: string) {
    return this.http.get<ESCellData[]>(this.apiServiceUrl + '/api/targ_rep/es_cell_by_symbol/' + geneSymbol);
  }

  getEsCellsByName(name: string) {
    return this.http.get<ESCellData>(this.apiServiceUrl + '/api/targ_rep/es_cell_by_name/' + name);
  }
}
