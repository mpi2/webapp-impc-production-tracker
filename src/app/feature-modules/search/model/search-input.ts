/* eslint-disable @typescript-eslint/naming-convention */
// eslint-disable-next-line no-shadow
export enum SearchInputType {
    File = 'File',
    Text = 'Text'
}

export class SearchInput {
    type: SearchInputType;
    value = '';
}
