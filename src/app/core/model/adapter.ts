/**
 * Interface for converting results from API to the internal model class.
 */
export interface Adapter<T> {
    adapt(item: any): T;
}
