import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class InputHandlerService {

    constructor() { }

    public getValueOrNull(value) {
        if (!value || '' === value) {
            return null;
        }
        return value;
    }

    public getNumericValueOrNull(value): number {
        if (!value || isNaN(value) || '' === value) {
            return null;
        }
        return Number(value);
    }

    public getEmptyIfNull(value: string): string {
        return value === null ? '' : value;
    }

    public getFalseIfNull(value: boolean): boolean {
        return value === null ? false : value;
    }

    public getUTCFormat(originalData: Date): Date {
        return new Date(originalData.toString() + 'T00:00:00Z');
    }

}
