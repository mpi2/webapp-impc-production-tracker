import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AlleleType } from '../_models';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})

export class AlleleTypeService {
  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<AlleleType[]>(`${environment.baseUrl}/tracking-api/alleleTypes`);
  }
}
