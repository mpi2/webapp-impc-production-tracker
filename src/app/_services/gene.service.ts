import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenesSummary, Gene } from '../_models';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class GeneService {
  // private _reqOptionsArgs = { headers: new HttpHeaders().set( 'Content-Type', 'application/json' ) };

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<GenesSummary[]>(`${environment.baseUrl}/api/genes`);
  }

  findGeneBySymbol(symbol: string, specie: string) {
    if (!symbol || !specie) {
      return of([]);
    }
    return this.http.get<Gene[]>(`${environment.baseUrl}/api/genes?symbol=${symbol}&specie=${specie}`);
  }
}
