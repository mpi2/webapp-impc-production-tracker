import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from 'src/app/core';
import { User } from 'src/app/core/model/user/user';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-profile-editor',
  templateUrl: './profile-editor.component.html',
  styleUrls: ['./profile-editor.component.css']
})
export class ProfileEditorComponent implements OnInit {

  loggedUser: User = new User();
  currentPassword;
  newPassword;
  newPasswordConfirmation;
  error;

  formGroup: FormGroup;

  displayedColumnsWorkUnitTable = ['Work Unit', 'Role'];
  displayedColumnsConsortiumTable = ['Consortium', 'Role'];

  constructor(
    private formBuilder: FormBuilder,
    private loggedUserService: LoggedUserService,
    private userService: UserService) { }

  ngOnInit(): void {
    this.setCurrentUser();
    this.formGroup = this.formBuilder.group({
    });
  }

  setCurrentUser(): void {
    if (this.loggedUserService.getLoggerUser()) {
      this.loggedUserService.getLoggerUser().subscribe(data => {
        this.loggedUser = data;
        console.log(data);
      }, error => {
        this.error = error;
      });
    }
  }

  enableUpdateButton() {
    return true;
  }

  onUpdate() {
    this.error = null;

    if (this.newPassword) {
      if (this.newPassword !== this.newPasswordConfirmation) {
        this.error = 'Please confirm correctly the new password.';
      } else {
        this.loggedUser.currentPassword = this.currentPassword;
        this.loggedUser.newPassword = this.newPassword;
      }

    }

    this.userService.updateUser(this.loggedUser).subscribe(data => {
    }, error => {
      this.error = error;
    });
  }

}
