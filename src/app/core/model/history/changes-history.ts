import { Injectable } from '@angular/core';
import { Adapter } from '../adapter';
import { HistoryDetail } from './history-detail';

/**
 * Class to keep information of the change in an object. It has a consecutive numer (id), the user that did the change,
 * the date when the change was done, the user that did the change. It also keeps an array with the properties (name, old value, new value)
 * that changed.
 */
export class ChangesHistory {
    id: number;
    user: string;
    date: Date = new Date();
    details: HistoryDetail[];
    action: string;
    comment: string;
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
        history.details = item.details;
        if (history.details) {
            history.details = history.details.filter(x => x.note !== 'Element changed');
        }
        history.comment = item.comment;
        history.action = item.action;
        history.details.map(x => x.formattedField = this.formatPropertyName(x.field));
        return history;
    }

    public formatPropertyName(name: string): string {
        let formattedProperty = name;
        let words = this.convertToArray(formattedProperty);
        words = this.removeNameAtEnd(words);
        words = words.map(x => this.capitalizeWord(x));
        formattedProperty = words.join(' ');

        return formattedProperty;
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
