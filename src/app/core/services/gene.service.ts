import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigAssetLoaderService } from './config-asset-loader.service';
import { Gene } from '../../model/bio/gene';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeneService {

  readonly likeCharacter = '%25';
  private apiServiceUrl;

  constructor(private http: HttpClient, private configAssetLoaderService: ConfigAssetLoaderService) {
    this.configAssetLoaderService.getConfig().then(data => this.apiServiceUrl = data.appServerUrl);
  }

  findGenesBySymbol(symbol: string) {
    return this.http.get<Gene[]>(this.apiServiceUrl + '/api/genes?symbol=' + symbol);
  }

  findGenesNamesStartingWith(symbol: string) {
    if (symbol.length >= 3) {
      const input = symbol + this.likeCharacter;

      return this.http.get<string[]>(this.apiServiceUrl + '/api/genesNamesInExternalData?input=' + input);
    } else {
      return this.http.get<string[]>(this.apiServiceUrl + '/api/genesNamesInExternalData?input=' + symbol);

    }
  }

  findGenesExternalDataBySymbol(symbol: string) {
    if (symbol.length >= 3) {
      const input = symbol + this.likeCharacter;

      return this.http.get<string[]>(this.apiServiceUrl + '/api/genesInExternalData?input=' + input);
    } else {
      return of(['']);
    }
  }
}
