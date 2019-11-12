import { Injectable } from '@angular/core';
import { SearchResult } from '../model/search.result';
import { HttpClient } from '@angular/common/http';
import { ConfigAssetLoaderService } from 'src/app/core/services/config-asset-loader.service';
import { Observable } from 'rxjs';
import { Search } from '../model/search';

@Injectable({
    providedIn: 'root'
})
export class SearchService {
    private apiServiceUrl;

    constructor(private http: HttpClient, private configAssetLoaderService: ConfigAssetLoaderService) {
        this.configAssetLoaderService.getConfig().then(data => this.apiServiceUrl = data.appServerUrl);
    }

    getAll(): Observable<SearchResult[]> {
        return this.http.get<SearchResult[]>(this.apiServiceUrl + '/api/projects/search');
    }

    search(search: Search, pageNumber: number): Observable<SearchResult[]> {
        const parameters = this.buildParameters(search, pageNumber);
        let url = this.apiServiceUrl + '/api/projects/search';

        url = parameters == null ? url : url + parameters;
        return this.http.get<SearchResult[]>(url);
    }

    private buildParameters(search: Search, pageNumber: number): string {
        let queryParameters = '?page=' + pageNumber;
        const searchTypeParameter = this.getSearchTypeParameter(search);
        const inputsParameter = this.getInputsParameter(search);
        const workUnitNamesParameter = this.getWorkUnitsNamesParameter(search);
        const workGroupNamesParameter = this.getWorkGroupNamesParameter(search);

        if (searchTypeParameter) {
            queryParameters += '&' + searchTypeParameter;
        }
        if (inputsParameter) {
            queryParameters += '&' + inputsParameter;
        }
        if (workUnitNamesParameter) {
            queryParameters += '&' + workUnitNamesParameter;
        }
        if (workGroupNamesParameter) {
            queryParameters += '&' + workGroupNamesParameter;
        }
        return queryParameters;
    }

    private getSearchTypeParameter(search: Search): string {
        let searchTypeParameter = null;
        if (search.searchType) {
            searchTypeParameter = 'searchTypeName=' + search.searchType;
        }
        return searchTypeParameter;
    }

    private getInputsParameter(search: Search): string {
        let inputsParameter = null;
        if (search.inputs) {
            inputsParameter = search.inputs.map(x => 'input=' + x.trim()).join('&');
        }
        return inputsParameter;
    }

    private getWorkUnitsNamesParameter(search: Search): string {
        let workUnitNamesParameter = null;
        if (search.filters.get('workUnitName')) {
            workUnitNamesParameter = search.filters.get('workUnitName').map(x => 'workUnitName=' + x.trim()).join('&');
        }
        return workUnitNamesParameter;
    }

    private getWorkGroupNamesParameter(search: Search): string {
        let workGroupNamesParameter = null;
        if (search.filters.get('workGroupName')) {
            workGroupNamesParameter = search.filters.get('workGroupName').map(x => 'workGroupName=' + x.trim()).join('&');
        }
        return workGroupNamesParameter;
    }
}
