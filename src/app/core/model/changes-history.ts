import { Injectable } from '@angular/core';
import { Adapter } from './adapter';

/**
 * Class that keeps information about the change in an entity.
 */
export class ChangesHistory {
    id: number;
    user: string;
    date: Date = new Date();
    changes: any[] = []
}

@Injectable({
    providedIn: 'root'
})

export class ChangesHistoryAdapter implements Adapter<ChangesHistory> {
    adapt(item: any): ChangesHistory {
        const history = new ChangesHistory();
        history.id = item.id;
        history.user = item.user;
        history.date = new Date(item.date);
        
        history.changes = item.action.split('\n').map(x => {
            const values = x.split('|');
            const property = values[0].replace('field:','').trim();
            const oldValue = values[1].replace('old:','');
            const newValue = values[2].replace('new:','');

            return { property: property, oldValue: oldValue, newValue: newValue }
        });

        return history;
    }
}