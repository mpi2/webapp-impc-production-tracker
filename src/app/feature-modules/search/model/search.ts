import { SearchInput } from './search-input';

export class Search {
    searchType: SearchType;
    inputs: string[];
    searchInput: SearchInput;
    filters: any = {};

    setPrivacies(privacies: string[]) {
        this.filters.privacyNames = privacies;
    }
}

export enum SearchType {
    Gene = 'gene',
    Location = 'location'
}

