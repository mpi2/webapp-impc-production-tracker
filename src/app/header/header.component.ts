import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  role: any;
  username: any;
  logout: boolean;

  constructor() { }

  ngOnInit() {
    if (sessionStorage.length > 0) {
      this.role = JSON.parse(sessionStorage.getItem('tokenInfo'))['role'];
      this.username = JSON.parse(sessionStorage.getItem('tokenInfo'))['username'];
      this.logout = false;
    } else {
      this.role = "";
      this.logout = true;
    }
  }

}
