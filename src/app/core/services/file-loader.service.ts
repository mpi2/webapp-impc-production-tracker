import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class FileLoaderService {

    getRecordsByColumn(records: any[], column) {
        const header: string[] = records[0];
        console.log('header: ', header);

        const data: string[] = records.slice(1);
        console.log('data: ', data);

        const index = header.findIndex(x => x.toLowerCase() === column.toLowerCase());
        console.log('index:', index);

        return data.map(x => x[index]);
    }
}
