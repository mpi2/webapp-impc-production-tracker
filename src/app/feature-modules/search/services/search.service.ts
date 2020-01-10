import { Injectable, EventEmitter } from '@angular/core';
import { SearchResult } from '../model/search.result';
import { HttpClient } from '@angular/common/http';
import { ConfigAssetLoaderService } from 'src/app/core/services/config-asset-loader.service';
import { Observable } from 'rxjs';
import { Search } from '../model/search';
import { SearchFilter } from '../model/search-filter';
import { Page } from 'src/app/model/page_structure/page';
import { SearchInputType } from '../model/search-input';
import { QueryBuilderService } from 'src/app/core';

@Injectable({
    providedIn: 'root'
})
export class SearchService {
    private apiServiceUrl;
    searchChange: EventEmitter<Search> = new EventEmitter();
    public search: Search;

    constructor(
        private http: HttpClient,
        private configAssetLoaderService: ConfigAssetLoaderService,
        private queryBuilderService: QueryBuilderService) {
        this.configAssetLoaderService.getConfig().then(data => this.apiServiceUrl = data.appServerUrl);
    }

    public emitSearchChange(search) {
        this.search = search;
        this.searchChange.emit(search);
    }

    public getAll(): Observable<SearchResult[]> {
        return this.http.get<SearchResult[]>(this.apiServiceUrl + '/api/projects/search');
    }

    public executeSearch(search: Search, page: Page): Observable<SearchResult[]> {
        let queryAsParameters = this.queryBuilderService.buildQueryParameters(search.filters, page);
        queryAsParameters = 'searchTypeName=' + search.searchType + '&' + queryAsParameters;

        if (search.searchInput.type === SearchInputType.Text) {
            return this.executeSearchByText(search, queryAsParameters);
        } else if (search.searchInput.type === SearchInputType.File) {
            return this.executeSearchByFile(search, queryAsParameters);
        }
    }

    private getInputTextQuery(search: Search) {
        let inputParameter;
        let input: string = search.searchInput.value;
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
        console.log(url);

        return this.http.get<SearchResult[]>(url);
    }

    private executeSearchByFile(search: Search, queryString: string): Observable<SearchResult[]> {
        let url = this.apiServiceUrl + '/api/projects/search?';
        const file = search.searchInput.value;
        url = url + queryString;
        console.log('the url by file', url);

        const formData: FormData = this.buildFormDataForFile(file);

        return this.http.post<SearchResult[]>(url, formData);
    }

    private buildFormDataForFile(file) {
        const formData: FormData = new FormData();
        formData.append('file', file, file.name);
        return formData;
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

    private isSearchByText(search: Search) {
        return search.searchInput.type === SearchInputType.Text;
    }

    private isSearchByFile(search: Search) {
        return search.searchInput.type === SearchInputType.File;
    }

    public exportCsv(search: Search) {
        if (this.isSearchByText(search)) {
            return this.exportCsvForTextInputSearch(search);
        } else if (this.isSearchByFile(search)) {
            return this.exportCsvForFileInputSearch(search);
        }
    }

    private exportCsvForTextInputSearch(search: Search) {
        const inputQuery = this.getInputTextQuery(search);
        let queryAsParameters = this.queryBuilderService.buildQueryParameters(search.filters, null);
        if (inputQuery) {
            queryAsParameters += '&' + inputQuery;
        }
        let url = this.apiServiceUrl + '/api/projects/search/exportSearch?';
        url += queryAsParameters;
        return this.http.get(url, { responseType: 'text' });
    }

    private exportCsvForFileInputSearch(search: Search) {
        let url = this.apiServiceUrl + '/api/projects/search/exportSearchByFile?';
        const queryAsParameters = this.queryBuilderService.buildQueryParameters(search.filters, null);
        url += queryAsParameters;
        const file = search.searchInput.value;
        const formData: FormData = this.buildFormDataForFile(file);
        console.log('url?', url);

        return this.http.post(url, formData, { responseType: 'text' });
    }
}
