import { Injectable } from '@angular/core';
import { Papa } from 'ngx-papaparse';

@Injectable({
    providedIn: 'root'
})
export class FileLoaderService {

    constructor(private papa: Papa) {}

    getRecordsByColumn(records: any[], column) {
        const header: string[] = records[0];
        console.log('header: ', header);

        const data: string[] = records.slice(1);
        console.log('data: ', data);

        const index = header.findIndex(x => x.toLowerCase() === column.toLowerCase());
        console.log('index:', index);

        return data.map(x => x[index]);
    }

    public jsonToCsv(json): string {
        console.log('json==>', json);
        return this.papa.unparse(json);
    }
}
