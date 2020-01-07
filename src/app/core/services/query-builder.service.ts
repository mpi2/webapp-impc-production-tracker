import { Injectable } from '@angular/core';
import { Page } from 'src/app/model/page_structure/page';

@Injectable({
    providedIn: 'root'
})
export class QueryBuilderService {

    public buildQueryParameters(filters: any, page: Page): string {
        const query: string[] = [];
        if (page) {
            query.push(this.getPaginationQuery(page));
        }
        query.push(this.getFilterQuery(filters));
        return query.join('&');
    }

    private getPaginationQuery(page: Page) {
        let query = 'page=' + page.number;
        if (page.size) {
            query += '&size=' + page.size;
        }
        return query;
    }

    private getFilterQuery(filters: any) {
        const filterParameters = [];
        if (filters) {
            Object.keys(filters).map(key => {
                const content = filters[key];
                const filterContent = this.getFilterByKeyAndContent(key, content);
                if (filterContent) {
                    filterParameters.push(filterContent);
                }
            });
        }
        return filterParameters.join('&');
    }

    private getFilterByKeyAndContent(key, content) {
        let filterContent;
        const validFilterContent = this.getValidFilterContent(content);

        if (validFilterContent) {
            filterContent = key + '=' + validFilterContent;
        }
        return filterContent;
    }

    private getValidFilterContent(content) {
        let validContent;
        if (Array.isArray(content)) {
            validContent = content.join(',');
        } else {
            validContent = content;
        }
        if (validContent === '') {
            validContent = undefined;
        }
        return validContent;
    }

}
