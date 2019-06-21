import { Component, OnInit } from '@angular/core';
import { MessageService } from '../core/services/message.service';
import { Subscription } from 'rxjs';
import { LoggedUserService } from '../core/services/logged-user.service';
import { LoggedUser } from '../core/model/logged-user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  role = "";
  username = "";
  login = false;
  subscription: Subscription;
  loggedUser: LoggedUser

  constructor(private messageService: MessageService, private loggedUserService: LoggedUserService) { }

  ngOnInit() {
    this.loggedUser = this.loggedUserService.getLoggerUser();
    this.setInitialInformation();

    this.subscription = this.messageService.getUserLoggedIn().subscribe(message => {
      if (message) {
        if (message.isUserLoggedIn) {
          this.loggedUser = this.loggedUserService.getLoggerUser();
          this.setInitialInformation();
        }
      }
    });
  }

  setInitialInformation() {
    if (this.loggedUser) {
      if (this.loggedUser.role) {
        this.role = this.loggedUser.role;
      }
      if (this.loggedUser.userName) {
        this.username = this.loggedUser.userName;
      }
      this.login = true;
    }
  }
}
