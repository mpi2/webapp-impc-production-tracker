import {
  Component,
  OnInit
} from '@angular/core';
import {
  Observable,
} from 'rxjs';
import {
  map
} from 'rxjs/operators';

import {
  AuthService,
  TokenService // Only needed to inspect other claims in the JWT token
} from 'angular-aap-auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  username: Observable < string | null > ;
  realname: Observable < string | null > ;
  token: Observable < string | null > ;

  // How to obtain other claims
  expiration: Observable < Date | null > ;
  iss: Observable < string | null > ;

  constructor(
      // Public for demonstration purposes
      private auth: AuthService,
      private jwt: TokenService
  ) {
      this.username = auth.username();
      this.realname = auth.realname();
      this.token = auth.token();

      this.expiration = this.token.pipe(
          map(token => jwt.getTokenExpirationDate())
      );

      this.iss = this.token.pipe(
          map(token => jwt.getClaim < string, null > ('iss', null))
      );
  }

  openLoginWindow() {
      // ttl: time of live, and location
      this.auth.windowOpen({
          ttl: '1'
      }, 500, 500, 100, 100);
  }

  logOut() {
      this.auth.logOut();
  }

  ngOnInit() {
      // Demonstration of register and unregister login events
      this.auth.addLogInEventListener(() => console.log('Welcome'));
      const firstEventID = this.auth.addLogInEventListener(() => console.log('This should not be visible'));
      this.auth.removeLogInEventListener(firstEventID);
      this.auth.addLogInEventListener(() => alert('Welcome'));
      const secondEventID = this.auth.addLogInEventListener(() => alert('This should never be displayed'));
      this.auth.removeLogInEventListener(secondEventID);

      // Demonstration of register and unregister logout events
      this.auth.addLogOutEventListener(() => console.log('Bye'));
      const thirdEventID = this.auth.addLogOutEventListener(() => console.log('This should not be visible'));
      this.auth.removeLogOutEventListener(thirdEventID);
      this.auth.addLogOutEventListener(() => alert('Bye'));
      const fourthEventID = this.auth.addLogOutEventListener(() => alert('This should never be displayed'));
      this.auth.removeLogOutEventListener(fourthEventID);
  }
}