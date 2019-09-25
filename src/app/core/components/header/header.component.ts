import { Component, OnInit } from '@angular/core';
import { LoggedUser } from '../../model/user/logged-user';
import { Subscription } from 'rxjs';
import { MessageService } from '../../services/message.service';
import { LoggedUserService } from '../../services/logged-user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isAdmin: boolean;
  userName = '';
  login = false;
  subscription: Subscription;
  loggedUser: LoggedUser

  constructor(private messageService: MessageService, private loggedUserService: LoggedUserService) {
    this.messageService.getMessage().subscribe(data => {
      const userLoggedIn = data.isUserLoggedIn;
      if (userLoggedIn) {
        this.setCurrentUser();
      }
    });
  }

  ngOnInit() {
  }

  setCurrentUser(): void {
    this.loggedUserService.getLoggerUser().subscribe(data => {
      this.loggedUser = data;
      this.setInitialInformation();
    });
  }

  setInitialInformation(): void {
    if (this.loggedUser) {
      this.isAdmin = this.loggedUser.admin;
      this.userName = this.loggedUser.userName;
      this.login = true;
    }
    else {
      this.isAdmin = null;
      this.userName = null;
      this.login = false;
    }
  }

}
