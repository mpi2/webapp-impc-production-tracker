import { Sort } from './sort';

export class Page {
    // eslint-disable-next-line id-blacklist
    number: number;
    size: number;
    totalElements?: number;
    totalPages?: number;
    sorts?: Sort[];
}
