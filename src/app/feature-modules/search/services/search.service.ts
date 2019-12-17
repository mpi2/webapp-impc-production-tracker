import { Injectable } from '@angular/core';
import { SearchResult } from '../model/search.result';
import { HttpClient } from '@angular/common/http';
import { ConfigAssetLoaderService } from 'src/app/core/services/config-asset-loader.service';
import { Observable } from 'rxjs';
import { Search } from '../model/search';
import { SearchFilter } from '../model/search-filter';
import { Page } from 'src/app/model/page_structure/page';

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

    public executeSearch(search: Search, page: Page): Observable<SearchResult[]> {
        const query: string[] = [];
        query.push(this.searchTypeQuery(search));
        query.push(this.getPaginationQuery(page));
        query.push(this.getFilterQuery(search));
        const queryAsParameters = query.join('&');

        if (search.inputDefinition.type === 'text') {
            return this.executeSearchByText(search, queryAsParameters);
        } else if (search.inputDefinition.type === 'file') {
            return this.executeSearchByFile(search, queryAsParameters);
        }
    }

    private searchTypeQuery(search: Search) {
        return 'searchTypeName=' + search.searchType;
    }

    private getPaginationQuery(page: Page) {
        let query = 'page=' + page.number;
        if (page.size) {
            query += '&size=' + page.size;
        }
        return query;
    }

    private getFilterQuery(search: Search) {
        return this.buildFilterParameters(search.filters);
    }

    private getInputTextQuery(search: Search) {
        let inputParameter;
        let input: string = search.inputDefinition.value;
        if (input) {
            input = input.split(',').map(x => x.trim()).join(',');
            if (input) {
                inputParameter = 'input=' + input;
            }
        }
        return inputParameter;
    }

    private executeSearchByText(search: Search, queryString: string): Observable<SearchResult[]> {
        let url = this.apiServiceUrl + '/api/projects/search?';
        const inputQuery = this.getInputTextQuery(search);
        if (inputQuery) {
            queryString += '&' + inputQuery;
        }
        url = url + queryString;
        console.log('url-->', url);
        return this.http.get<SearchResult[]>(url);
    }

    private executeSearchByFile(search: Search, queryString: string): Observable<SearchResult[]> {
        let url = this.apiServiceUrl + '/api/projects/search?';
        const inputDefinition = search.inputDefinition;
        let file;
        if (inputDefinition) {
            if (inputDefinition.type && inputDefinition.type === 'file') {
                file = inputDefinition.value;
            }
        }
        url = url + queryString;
        const formData: FormData = new FormData();
        formData.append('file', file, file.name);
        return this.http.post<SearchResult[]>(url, formData);
    }

    buildFilterParameters(filters: SearchFilter) {
        const filterParameters = [];
        if (filters) {
            Object.keys(filters).map(key => {
                const content = filters[key];
                if (content && content.length > 0) {
                    const filterContent = key + '=' + content.join(',');
                    filterParameters.push(filterContent);
                }

            });
        }
        return filterParameters.join('&');
    }

    search(search: Search, pageNumber: number): Observable<SearchResult[]> {
        const parameters = this.buildParameters(search, pageNumber);
        let url = this.apiServiceUrl + '/api/projects/search';

        url = parameters == null ? url : url + parameters;
        console.log('URL', url);

        return this.http.get<SearchResult[]>(url);
    }

    private buildParameters(search: Search, pageNumber: number): string {
        let queryParameters = '?page=' + pageNumber;
        const searchTypeParameter = this.getSearchTypeParameter(search);
        const inputsParameter = this.getInputsParameter(search);
        const workUnitNamesParameter = this.getWorkUnitsNamesParameter(search);
        const workGroupNamesParameter = this.getWorkGroupNamesParameter(search);
        const privaciesParameter = this.getPrivaciesParameter(search);

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
        if (privaciesParameter) {
            queryParameters += '&' + privaciesParameter;
        }
        console.log('queryParameters', queryParameters);

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
        if (search.filters.workUnitNames) {
            workUnitNamesParameter = search.filters.workUnitNames.map(x => 'workUnitName=' + x.trim()).join('&');
        }
        return workUnitNamesParameter;
    }

    private getWorkGroupNamesParameter(search: Search): string {
        let workGroupNamesParameter = null;
        if (search.filters.workGroupNames) {
            workGroupNamesParameter = search.filters.workGroupNames.map(x => 'workGroupName=' + x.trim()).join('&');
        }
        return workGroupNamesParameter;
    }

    private getPrivaciesParameter(search: Search): string {
        let privaciesParameter = null;
        if (search.filters.privacyNames) {
            privaciesParameter = search.filters.privacyNames.map(x => 'privacyName=' + x.trim()).join('&');
        }
        return privaciesParameter;
    }
}
