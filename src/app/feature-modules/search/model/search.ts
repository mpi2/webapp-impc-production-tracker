import { SearchInput } from './search-input';

// eslint-disable-next-line no-shadow
export enum SearchType {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Gene = 'gene',
    // eslint-disable-next-line @typescript-eslint/naming-convention
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
