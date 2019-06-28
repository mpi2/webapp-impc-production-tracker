import { Injectable } from '@angular/core';
import { Adapter } from 'src/app/core/model/adapter';

export class PlanHistory {
    id: number;
    user: string;
    date: Date = new Date();
    action: string;
}

@Injectable({
    providedIn: 'root'
})

export class PlanHistoryAdapter implements Adapter<PlanHistory> {
    adapt(item: any): PlanHistory {
        const planHistory = new PlanHistory();
        planHistory.id = item.id;
        planHistory.user = item.user;
        planHistory.date = new Date(item.date);
        planHistory.action = item.action;

        const individualChanges = new Map<string, string>();
        let changes: string[] = item.action.split('\n');
        changes = changes.map(x => {
            const values = x.split('|');
            const property = values[0].replace('field:','').trim();
            const oldValue = values[1].replace('old:','');
            const newValue = values[2].replace('new:','');

            return property + ":" + '[' + oldValue + '] => [' + newValue + ']'
        });
        planHistory.action = changes.join('\n');

        return planHistory;
    }
}