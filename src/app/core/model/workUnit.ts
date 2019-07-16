import { Injectable } from '@angular/core';
import { Adapter } from './adapter';

export class WorkUnit {
    name: string;
    code: string;
}

@Injectable({
    providedIn: 'root'
})

export class WorkUnitAdapter implements Adapter<WorkUnit> {
    adapt(item: any): WorkUnit {
        const workUnit = new WorkUnit();
        workUnit.name = item.name;
        workUnit.code = item.ilarCode;
        return workUnit;
    }
}
