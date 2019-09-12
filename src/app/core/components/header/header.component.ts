import { Component, OnInit } from '@angular/core';
import { LoggedUser } from '../../model/user/logged-user';
import { Subscription } from 'rxjs';
import { MessageService } from '../../services/message.service';
import { LoggedUserService } from '../../services/logged-user.service';
import { MatMenuModule, MatToolbarModule,
  MatTooltipModule} from '@angular/material';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  role = '';
  user_name = '';
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
        else{
          this.login = false;
          this.loggedUser = null;
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
        this.user_name = this.loggedUser.userName;
      }
      this.login = true;
    }
  }

}
