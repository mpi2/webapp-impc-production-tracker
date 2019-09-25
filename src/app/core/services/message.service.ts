import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
/**
 * Service to send some messages between other services/components in the application.
 */
export class MessageService {

  private subject = new Subject<any>();

  setUserLoggedIn(loggedIn: boolean): void {
    this.subject.next({ isUserLoggedIn: loggedIn });
  }

  getUserLoggedIn(): Observable<any> {
    return this.subject.asObservable();
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }

  setMessage(message): void {
    this.subject.next({ message });
  }
}
