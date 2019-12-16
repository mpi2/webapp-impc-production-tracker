export class FilterDefinition {
    name: string;
    title: string;
    label?: string;
    dataSource?: NamedValue[] = [];
    type: string;
    expanded ? = false;
    placeholder?: string;
}
