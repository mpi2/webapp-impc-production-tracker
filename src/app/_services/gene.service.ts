import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GeneSummary } from '../_models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeneService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<GeneSummary[]>(`${environment.baseUrl}/tracking-api/genes`);
  }

}
