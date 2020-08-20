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

}
