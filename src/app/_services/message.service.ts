import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MessageService {
    private subject = new Subject<any>();

    sendUpdatedLoginInfo(loginInfo: any) {
        this.subject.next({ loginInfo: loginInfo});
    }

    getUpdatedLoginInfo(): Observable<any> {
        return this.subject.asObservable();
    }

    getCurrentLoginInfo() {
        return JSON.parse(sessionStorage.getItem('tokenInfo'));
    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
}