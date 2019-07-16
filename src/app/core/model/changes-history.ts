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
            let property = values[0].replace('field:', '').trim();
            property = this.formatPropertyName(property);
            const oldValue = values[1].replace('old:', '');
            const newValue = values[2].replace('new:', '');

            return { property: property, oldValue: oldValue, newValue: newValue }
        });

        return history;
    }

    private formatPropertyName(name: string): string {
        let result = name;
        let words = this.convertToArray(name);
        words = this.removeNameAtEnd(words);
        words = words.map(x => this.capitalizeWord(x));
        result = words.join(' ');
        console.log(name, '=>', result);

        return result;
    }

    private convertToArray(name: string): string[] {
        const WORDS_SEPARATOR = '.';
        return name.split(WORDS_SEPARATOR);
    }

    private capitalizeWord(word: string): string {
        let result = null;
        if (word && word.length > 0) {
            result = word[0].toUpperCase() + word.slice(1);
        }
        return result;
    }

    private removeNameAtEnd(words: string[]): string[] {
        let result = words;
        if (words.length > 1 && 'name' === words[words.length - 1]) {
            result = words.slice(0, words.length - 1);
        }
        return result;
    }
}