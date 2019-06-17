
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Injectable({
    providedIn: 'root'
  })
  export class ConfigurationService {
  
    constructor(private http: HttpClient) {}
    getConfiguration() {
        console.log('soo',`${environment.baseUrl}/api/conf`);
        
      return this.http.get<any>(`${environment.baseUrl}/api/conf`);
    }
  }