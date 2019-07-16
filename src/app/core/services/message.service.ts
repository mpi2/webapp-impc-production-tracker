import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MessageService {
    private subject = new Subject<any>();

    setUserLoggedIn(loggedIn: boolean) {
        this.subject.next( { isUserLoggedIn: loggedIn} );
    }

    getUserLoggedIn(): Observable<any> {
        return this.subject.asObservable();
    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
}