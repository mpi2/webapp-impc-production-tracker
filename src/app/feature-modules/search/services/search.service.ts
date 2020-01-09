import { Injectable, EventEmitter } from '@angular/core';
import { SearchResult } from '../model/search.result';
import { HttpClient } from '@angular/common/http';
import { ConfigAssetLoaderService } from 'src/app/core/services/config-asset-loader.service';
import { Observable } from 'rxjs';
import { Search, SearchType } from '../model/search';
import { SearchFilter } from '../model/search-filter';
import { Page } from 'src/app/model/page_structure/page';
import { SearchInputType } from '../model/search-input';

@Injectable({
    providedIn: 'root'
})
export class SearchService {
    private apiServiceUrl;
    searchChange: EventEmitter<Search> = new EventEmitter();
    public search: Search;

    constructor(private http: HttpClient, private configAssetLoaderService: ConfigAssetLoaderService) {
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
        const queryAsParameters = this.buildQueryParameters(search, page);

        if (search.searchInput.type === SearchInputType.Text) {
            return this.executeSearchByText(search, queryAsParameters);
        } else if (search.searchInput.type === SearchInputType.File) {
            return this.executeSearchByFile(search, queryAsParameters);
        }
    }

    private buildQueryParameters(search: Search, page: Page): string {
        const query: string[] = [];
        query.push(this.searchTypeQuery(search));
        if (page) {
            query.push(this.getPaginationQuery(page));
        }
        query.push(this.getFilterQuery(search));
        return query.join('&');
    }

    private searchTypeQuery(search: Search) {
        return 'searchTypeName=' + (search.searchType === SearchType.Gene ? 'gene' : 'undefined');
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
        let queryAsParameters = this.buildQueryParameters(search, null);
        if (inputQuery) {
            queryAsParameters += '&' + inputQuery;
        }
        let url = this.apiServiceUrl + '/api/projects/search/exportSearch?';
        url += queryAsParameters;
        return this.http.get(url, { responseType: 'text' });
    }

    private exportCsvForFileInputSearch(search: Search) {
        let url = this.apiServiceUrl + '/api/projects/search/exportSearchByFile?';
        const queryAsParameters = this.buildQueryParameters(search, null);
        url += queryAsParameters;
        const file = search.searchInput.value;
        const formData: FormData = this.buildFormDataForFile(file);
        console.log('url?', url);

        return this.http.post(url, formData, { responseType: 'text' });
    }
}
