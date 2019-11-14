import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/core/model/user/user';
import { UserService } from 'src/app/core/services/user.service';
import { EntityValues } from '../../model/entity-values';
import { ManagedListsService } from 'src/app/core/services/managed-lists.service';
import { LoggedUserService } from 'src/app/core';
import { RoleWorkUnit } from 'src/app/core/model/user/role_work_unit';
import { RoleConsortium } from 'src/app/core/model/user/role_consortium';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { InformativeDialogComponent } from 'src/app/shared/components/informative-dialog/informative-dialog.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  userLists: EntityValues[];
  signupForm: FormGroup;

  loading = false;
  submitted = false;
  error = '';
  user: User = new User();

  workUnits: NamedValue[] = [];
  roles: NamedValue[] = [];
  consortia: NamedValue[] = [];

  selectedWorkUnits: string[];
  selectedConsortia: string[];

  listsByUser: EntityValues[];

  roleWorkUnits: RoleWorkUnit[] = [];
  roleConsortia: RoleConsortium[] = [];

  nextNewIdRoleWorkUnits = -1;
  nextNewIdRoleConsortia = -1;

  adminUser = false;

  formTitle = '';
  buttonText = '';
  updatingUser = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private managedListsService: ManagedListsService,
    private loggedUserService: LoggedUserService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      name: ['', Validators.required],
      password: ['', Validators.required],
      newPassword: [''],
      email: ['', [Validators.required, Validators.email]],
      isAdmin: []
    });

    this.initUserData();

    this.loggedUserService.getLoggerUser()
      .subscribe((data: User) => {
        this.adminUser = data.isAdmin;
        if (this.adminUser) {
          this.addWorkUnitRole();
          this.addConsortiumRole();
        }
      }
      );

    this.managedListsService.getManagedListsByUser().subscribe(data => {
      this.listsByUser = data;
      this.initLists();
    });
  }

  private initUserData() {
    const email = this.route.snapshot.params.id;
    if (email) {
      this.userService.getUserByEmail(email).subscribe(data => {
        this.user = data;
        this.roleWorkUnits = this.user.rolesWorkUnits;
        this.roleConsortia = this.user.rolesConsortia;
        this.selectedWorkUnits = this.roleWorkUnits.map(x => x.workUnitName);
        this.updatingUser = true;
        this.formTitle = 'Update existing account';
        this.buttonText = 'Update';
        this.error = '';
        this.setControlValuesForUpdate();
      }, error => {
        this.error = error;
      });
    } else {
      this.formTitle = 'Creation of new account';
      this.buttonText = 'Create';
      this.updatingUser = false;
      this.user = new User();
    }
  }

  private setControlValuesForUpdate() {
    // Dummy password to make the form valid. The value is not used in the update request
    this.f.password.setValue('password');
    this.f.name.setValue(this.user.name);
    this.f.email.setValue(this.user.email);
    this.f.isAdmin.setValue(this.user.isAdmin);
  }

  private initLists() {
    this.workUnits = this.managedListsService.getValuesByEntity(this.listsByUser, 'workUnits');
    this.roles = this.managedListsService.getValuesByEntity(this.listsByUser, 'roles');
    this.consortia = this.managedListsService.getValuesByEntity(this.listsByUser, 'consortia');
  }

  // convenience getter for easy access to form fields
  get f() { return this.signupForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.user.isAdmin = this.f.isAdmin.value;
    this.user.rolesWorkUnits = this.getNotNullRolesWorkUnits(this.getRoleWorkUnits());
    this.user.rolesConsortia = this.getNotNullRolesConsortia(this.getRoleConsortia());
    this.validateData(this.user);
    console.log('submit', this.user);
  }

  getNotNullRolesWorkUnits(rolesWorkUnits: RoleWorkUnit[]) {
    return rolesWorkUnits.filter(x => x.roleName || x.workUnitName);
  }

  getNotNullRolesConsortia(rolesConsortia: RoleConsortium[]) {
    return rolesConsortia.filter(x => x.roleName || x.consortiumName);
  }

  validateData(user: User) {
    this.validateRolesWorkUnits(user.rolesWorkUnits);
    this.validateRolesConsortia(user.rolesConsortia);
  }

  validateRolesConsortia(rolesConsortia: RoleConsortium[]) {
    const incompleteRecords = rolesConsortia.find(x => !x.roleName || !x.consortiumName);
    if (incompleteRecords) {
      this.showErrorDialog('Consortium association(s)', 'Set a Consortium and a role for all the associations.');
    }
  }

  validateRolesWorkUnits(rolesWorkUnits: RoleWorkUnit[]) {
    const incompleteRecords = rolesWorkUnits.find(x => !x.roleName || !x.workUnitName);
    if (incompleteRecords) {
      this.showErrorDialog('Work unit association(s):', 'Set a Work Unit and a role for all the associations.');
    }
  }

  showErrorDialog(title, message) {
    const dialogRef = this.dialog.open(InformativeDialogComponent, {
      width: '250px',
      data: {
        title,
        text: message
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  private getRoleWorkUnits() {
    let roleWorkUnits: RoleWorkUnit[] = [];
    if (this.adminUser) {
      roleWorkUnits = this.roleWorkUnits;
    } else {
      if (this.selectedWorkUnits) {
        this.selectedWorkUnits.map(x => {
          roleWorkUnits.push({ id: this.nextNewIdRoleWorkUnits--, workUnitName: x, roleName: 'general' });
        });
      }
    }
    return roleWorkUnits;
  }

  private getRoleConsortia() {
    let roleConsortia: RoleConsortium[] = [];
    if (this.adminUser) {
      roleConsortia = this.roleConsortia;
    } else {
      if (this.selectedConsortia) {
        this.selectedConsortia.map(x => {
          roleConsortia.push({ id: this.nextNewIdRoleConsortia--, consortiumName: x, roleName: 'general' });
        });
      }
    }
    return roleConsortia;
  }

  getEmailErrorMessage() {
    return this.f.email.hasError('required') ? 'You must enter a value' :
      this.f.email.hasError('email') ? 'Not a valid email' :
        '';
  }

  addWorkUnitRole() {
    const roleWorkUnit: RoleWorkUnit = new RoleWorkUnit();
    roleWorkUnit.id = this.nextNewIdRoleWorkUnits--;
    this.roleWorkUnits.push(roleWorkUnit);
  }

  addConsortiumRole() {
    const roleConsortium: RoleConsortium = new RoleConsortium();
    roleConsortium.id = this.nextNewIdRoleConsortia--;
    this.roleConsortia.push(roleConsortium);
  }

  deleteWorkUnitRole(roleWorkUnit) {
    this.roleWorkUnits = [...this.roleWorkUnits.filter(x => x.id !== roleWorkUnit.id)];
  }

  deleteConsortiumRole(roleConsortium) {
    this.roleConsortia = [...this.roleConsortia.filter(x => x.id !== roleConsortium.id)];
  }
}
