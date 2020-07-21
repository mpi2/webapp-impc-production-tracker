import { Sort } from './sort';

export class Page {
    number: number;
    size: number;
    totalElements?: number;
    totalPages?: number;
    sorts?: Sort[];
}
