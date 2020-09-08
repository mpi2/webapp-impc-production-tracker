import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from 'src/app/core';
import { User } from 'src/app/core/model/user/user';

@Component({
  selector: 'app-profile-editor',
  templateUrl: './profile-editor.component.html',
  styleUrls: ['./profile-editor.component.css']
})
export class ProfileEditorComponent implements OnInit {

  loggedUser: User = new User();
  email = 'email@a.com';
  contactable;
  currentPassword;
  newPassword;
  newPasswordConfirmation;

  displayedColumnsWorkUnitTable = ['Work Unit', 'Role'];
  displayedColumnsConsortiumTable = ['Consortium', 'Role'];

  constructor(private loggedUserService: LoggedUserService, ) { }

  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser(): void {
    if (this.loggedUserService.getLoggerUser()) {
      this.loggedUserService.getLoggerUser().subscribe(data => {
        this.loggedUser = data;
        console.log(data);

      });
    }
  }

}
