import { Injectable } from '@angular/core';
import { Adapter } from './adapter';

/**
 * Class that keeps information about the change in an entity.
 */
export class ChangesHistory {
    id: number;
    user: string;
    date: Date = new Date();
    action: string;
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
        history.action = item.action;

        let changes: string[] = item.action.split('\n');
        changes = changes.map(x => {
            const values = x.split('|');
            const property = values[0].replace('field:','').trim();
            const oldValue = values[1].replace('old:','');
            const newValue = values[2].replace('new:','');

            return property + ":" + '[' + oldValue + '] => [' + newValue + ']'
        });
        history.action = changes.join('\n');

        return history;
    }
}