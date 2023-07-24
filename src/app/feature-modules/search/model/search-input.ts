export enum SearchInputType {
    File = 'File',
    Text = 'Text'
}

export class SearchInput {
    type: SearchInputType;
    value = '';
}
