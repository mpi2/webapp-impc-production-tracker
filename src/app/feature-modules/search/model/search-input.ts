export class SearchInput {
    type: SearchInputType;
    value = '';
}
export enum SearchInputType {
    File = 'File',
    Text = 'Text'
}
