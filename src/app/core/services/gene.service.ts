import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Gene } from '../model/bio/gene';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeneService {

  constructor(private http: HttpClient) { }

  findGenesBySymbol(symbol: string) {
    return this.http.get<Gene[]>(`${environment.baseUrl}/api/genes?symbol=${symbol}`);
}
}
