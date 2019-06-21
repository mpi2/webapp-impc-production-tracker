import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { ConfigurationData } from '../model/configuration-data';
import { Permission } from '../model/permission';

@Injectable()
export class BasicDataService {

    constructor(private http: HttpClient) { }

    // Returns an object with configuration information: The available work units, work groups, priorities, plan types, etc.
    getConfiguration() {
        return this.http.get<ConfigurationData>(`${environment.baseUrl}/api/conf`);
    }

    // Returns an object with permissions for the logged user.
    getPermissions() {
        return this.http.get<Permission>(`${environment.baseUrl}/api/permissions`);
    }
}