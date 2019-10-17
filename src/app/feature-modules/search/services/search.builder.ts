import { Search } from '..';

export class SearchBuilder {
    searchType: string;
    inputs: string[];
    filters: Map<string, string[]> = new Map();

    private constructor() {}

    public static getInstance(): SearchBuilder {
        return new SearchBuilder();
    }

    public build(): Search {
        const search: Search = new Search();
        search.searchType = this.searchType;
        search.inputs = this.inputs;
        search.filters = this.filters;
        return search;
    }

    withSearchType(searchType: string): SearchBuilder {
        this.searchType = searchType;
        return this;
    }

    withInputs(inputs: string[]): SearchBuilder {
        this.inputs = inputs;
        return this;
    }

    withWorkUnitsNames(workUnitsNames: string[]): SearchBuilder {
        this.filters.set('workUnitName', workUnitsNames);
        return this;
    }
}
