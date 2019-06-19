import { Component, OnInit } from '@angular/core';
import { MessageService } from '../_services/message.service';
import { Subscription } from 'rxjs';

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
  loginInfo: any;

  constructor(private messageService: MessageService) { }

  ngOnInit() {
    this.loginInfo = this.messageService.getCurrentLoginInfo();
    this.setInitialInformation();

    this.subscription = this.messageService.getMessage().subscribe(message => {
      if (message) {
        if (message['loginInfo']) {
          this.loginInfo = message['loginInfo'];
          this.setInitialInformation();
        }
      }
    });
  }

  setInitialInformation() {
    if (this.loginInfo) {
      if (this.loginInfo.role) {
        this.role = this.loginInfo.role;
      }
      if (this.loginInfo.username) {
        this.username = this.loginInfo.username;
      }
      this.login = true;
    }
  }
}
