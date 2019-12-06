import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessageService } from '../../services/message.service';
import { LoggedUserService } from '../../services/logged-user.service';
import { User } from '../../model/user/user';
import { PermissionsService } from '../../services/permissions.service';

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
  loggedUser: User;
  canSeeProjectList: boolean;

  title = 'GenTaR';

  constructor(private messageService: MessageService, private loggedUserService: LoggedUserService) {
    this.messageService.getMessage().subscribe(data => {
      const userLoggedIn = data.isUserLoggedIn;
      if (userLoggedIn) {
        this.setCurrentUser();
      } else {
        this.cleanData();
      }
    });
  }

  ngOnInit() {
    if (!this.loggedUser) {
      this.setCurrentUser();
    }
  }

  setCurrentUser(): void {
    if (this.loggedUserService.getLoggerUser()) {
      this.loggedUserService.getLoggerUser().subscribe(data => {
        this.loggedUser = data;
        this.setInitialInformation();
      });
    } else {
      this.cleanData();
    }
  }

  public setInitialInformation(): void {
    if (this.loggedUser) {
      this.isAdmin = PermissionsService.canExecuteManagerTasks(this.loggedUser);
      this.userName = this.loggedUser.name;
      const hasAtLeastOneWorkUnit = this.loggedUser.rolesWorkUnits.length > 0;
      this.canSeeProjectList = hasAtLeastOneWorkUnit || this.isAdmin;
      this.login = true;
    }
  }

  cleanData(): void {
    this.isAdmin = null;
    this.userName = null;
    this.login = false;
  }

}
