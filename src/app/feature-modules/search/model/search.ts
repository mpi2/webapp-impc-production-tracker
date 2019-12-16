import { SearchFilter } from './search-filter';

export class Search {
    searchType: string;
    inputs: string[];
    filters: SearchFilter;
    inputDefinition: any;

    setPrivacies(privacies: string[]) {
        this.filters.privacyNames = privacies;
    }
}
