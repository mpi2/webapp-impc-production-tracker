import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Gene } from '../model/bio/gene';
import { environment } from 'src/environments/environment';
import {ConfigAssetLoaderService} from './config-asset-loader.service';

@Injectable({
  providedIn: 'root'
})
export class GeneService {

  private url;

  constructor(private http: HttpClient, private configAssetLoaderService: ConfigAssetLoaderService) {
    this.configAssetLoaderService.loadConfigurations().subscribe(data => this.url = data.appServerUrl);
  }

  findGenesBySymbol(symbol: string) {
    return this.http.get<Gene[]>(this.url + '/api/genes?symbol=' + symbol );
  }
}
