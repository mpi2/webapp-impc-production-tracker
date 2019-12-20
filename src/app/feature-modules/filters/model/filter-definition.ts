import { FilterType } from './filter-type';

export class FilterDefinition {
    name: string;
    title: string;
    label?: string;
    dataSource?: NamedValue[] = [];
    type: FilterType;
    expanded ? = false;
    placeholder?: string;
}
