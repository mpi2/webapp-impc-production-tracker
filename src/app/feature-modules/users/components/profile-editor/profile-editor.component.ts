import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from 'src/app/core';
import { User } from 'src/app/core/model/user/user';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from 'src/app/core/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  isLoading = false;

  formGroup: FormGroup;

  displayedColumnsWorkUnitTable = ['Work Unit', 'Role'];
  displayedColumnsConsortiumTable = ['Consortium', 'Role'];

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
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
      }, error => {
        this.error = error;
      });
    }
  }

  enableUpdateButton() {
    return true;
  }

  onUpdate() {
    this.isLoading = true;
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
      this.isLoading = false;
      this.snackBar.open('Data updated.', 'Close', {
        duration: 1500,
      });

    }, error => {
      this.isLoading = false;
      this.error = error;
    });
  }

}
