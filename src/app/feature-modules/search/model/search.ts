import { SearchInput } from './search-input';

// eslint-disable-next-line no-shadow
export enum SearchType {
    Gene = 'gene',
    Location = 'location'
}

export class Search {
    searchType: SearchType;
    inputs: string[];
    searchInput: SearchInput;
    filters: any = {};

    setPrivacies(privacies: string[]) {
        this.filters.privacyNames = privacies;
    }
}
