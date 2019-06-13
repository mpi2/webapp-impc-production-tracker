import { Injectable } from '@angular/core';
import { Adapter } from '../_core/adapter';

export class WorkGroup {
    name: string;
}

@Injectable({
    providedIn: 'root'
})

export class WorkGroupAdapter implements Adapter<WorkGroup> {
    adapt(item: any): WorkGroup {
        const workGroup = new WorkGroup();
        workGroup.name = item.name;
        return workGroup;
    }
}
