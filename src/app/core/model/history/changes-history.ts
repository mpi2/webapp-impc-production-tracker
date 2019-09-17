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
    private readonly COLLECTION_SYMBOL = '#';
    adapt(item: any): ChangesHistory {
        const history = new ChangesHistory();
        history.id = item.id;
        history.user = item.user;
        history.date = new Date(item.date);
        history.details = item.details;
        history.comment = item.comment;
        history.action = item.action;
        history.details.map(x => x.formattedField = this.formatPropertyName(x.field));
        history.details.map(x => x.description = this.buildDetailDescription(x.formattedField, x.field, x.newValue, x.oldValue));

        return history;
    }

    public buildDetailDescription(formattedField, field, newValue, oldValue): string {
        let description;

        if (this.isElementInCollection(field)) {
            description = this.buildDetailDescriptionForCollectionElement(formattedField, newValue, oldValue);
        } else {
            description = formattedField  + ' updated';
        }
        
        return description;
    }

    private buildDetailDescriptionForCollectionElement(formattedField, newValue, oldValue) {
        let actionOnField;
        let description;

        actionOnField = this.getActionOnCollectionElement(newValue, oldValue);

        description = 'Element in ' + formattedField + ' ' + actionOnField;
        return description;
    }

    private getActionOnCollectionElement(newValue, oldValue) {
        let action;
        if (newValue && oldValue) {
            action = 'updated'
        }
        else if (newValue) {
            action = 'added'
        }
        else {
            action = 'deleted'
        }
        return action;
    }

    public isElementInCollection(field: string): boolean {
        return field.includes(this.COLLECTION_SYMBOL);
    }

    public formatPropertyName(name: string): string {
        let formattedProperty = this.removeCollectionSymbol(name);
        let words = this.convertToArray(formattedProperty);
        words = this.removeNameAtEnd(words);
        words = words.map(x => this.capitalizeWord(x));
        formattedProperty = words.join(' ');

        return formattedProperty;
    }

    private removeCollectionSymbol(text) {
        let result = text;
        let indexOfSymbol = text.indexOf(this.COLLECTION_SYMBOL);
        if (indexOfSymbol > 0) {
            result = result.substr(0, indexOfSymbol);
        }
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
