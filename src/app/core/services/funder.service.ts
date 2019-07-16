import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FunderService {

  constructor(private http: HttpClient) { }

  getAllFundersByWorkGroup(name: string) {
    return this.http.get<any[]>(`${environment.baseUrl}/api/funders?workGroupName=${name}`);
  }
}
