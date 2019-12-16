import { Search } from '..';
import { SearchFilter } from '../model/search-filter';

export class SearchBuilder {
    searchType: string;
    inputs: string[];
    filters: SearchFilter;

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

    withPrivacies(privacies: string[]): SearchBuilder {
        this.filters.privacyNames = privacies;
        return this;
    }

    withWorkUnitsNames(workUnitsNames: string[]): SearchBuilder {
        this.filters.workUnitNames = workUnitsNames;
        return this;
    }

    withWorkGroupNames(workGroupNames: string[]): SearchBuilder {
        this.filters.workGroupNames = workGroupNames;
        return this;
    }
}
