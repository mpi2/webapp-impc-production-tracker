import { FilterType } from './filter-type';
import { NamedValue } from 'src/app/core/model/common/named-value';


export class FilterDefinition {
    name: string;
    title: string;
    label?: string;
    dataSource?: NamedValue[] = [];
    type: FilterType;
    expanded ? = false;
    placeholder?: string;
}
