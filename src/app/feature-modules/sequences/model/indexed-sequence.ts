import { IndexedLocation } from './indexed-location';

export class IndexedSequence {
    index: number;
    sequence: string;
    typeName: string;
    categoryName: string;
    sequenceLocations: IndexedLocation[];
}
