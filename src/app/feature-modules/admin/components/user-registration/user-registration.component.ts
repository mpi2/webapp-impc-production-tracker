import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/core/model/user/user';
import { UserService } from 'src/app/core/services/user.service';
import { EntityValues } from '../../model/entity-values';
import { ManagedListsService } from 'src/app/feature-modules/services/managed-lists.service';
import { LoggedUserService, LoggedUser } from 'src/app/core';
import { RoleWorkUnit } from 'src/app/core/model/user/role_work_unit';
import { RoleConsortium } from 'src/app/core/model/user/role_consortium';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent implements OnInit {

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

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private managedListsService: ManagedListsService,
    private loggedUserService: LoggedUserService) { }

  ngOnInit() {
    const id = this.route.snapshot.params.id;
    console.log('id=>', id);

    this.signupForm = this.formBuilder.group({
      name: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      isAdmin: []
    });

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

  private initLists() {
    this.workUnits = this.getValuesByEntity('workUnits');
    this.roles = this.getValuesByEntity('roles');
    this.consortia = this.getValuesByEntity('consortia');
  }

  private getValuesByEntity(name: string) {
    let results: NamedValue[] = [];
    const entityValues: EntityValues = this.listsByUser.find(x => x.entityName === name);
    if (entityValues) {
      results = entityValues.values;
    }
    return results;
  }

  // convenience getter for easy access to form fields
  get f() { return this.signupForm.controls; }

  onSubmit() {
    this.submitted = true;
    const user = this.buildUserObject();
    console.log('user', user);
    console.log('selectedWorkUnits', this.selectedWorkUnits);



    // this.loading = true;
    // this.user = {
    //   name: this.f.name.value,
    //   password: this.f.password.value,
    //   email: this.f.email.value,
    //   workUnitName: this.f.workUnit.value[0],
    //   instituteName: this.f.institute.value,
    //   roleName: this.f.role.value[0]
    // };
    // console.log('user: ', this.user);
    // this.userService.createUser(this.user)
    //   .pipe(first())
    //   .subscribe(
    //     data => {
    //       this.loading = false;
    //     },
    //     error => {
    //       this.error = error;
    //       this.loading = false;
    //       console.log('error: ', this.error);
    //     });
  }

  private buildUserObject(): User {
    const user = new User();
    user.name = this.f.name.value;
    user.password = this.f.password.value;
    user.email = this.f.email.value;
    user.roleWorkUnits = this.getRoleWorkUnits();
    user.roleConsortia = this.getRoleConsortia();
    return user;
  }

  private getRoleWorkUnits() {
    let roleWorkUnits: RoleWorkUnit[] = [];
    if (this.adminUser) {
      roleWorkUnits = this.roleWorkUnits;
    } else {
      this.selectedWorkUnits.map(x => {
        roleWorkUnits.push({ id: this.nextNewIdRoleWorkUnits--, workUnitName: x, roleName: 'general' });
      });
    }
    return roleWorkUnits;
  }

  private getRoleConsortia() {
    let roleConsortia: RoleConsortium[] = [];
    if (this.adminUser) {
      roleConsortia = this.roleConsortia;
    } else {
      this.selectedConsortia.map(x => {
        roleConsortia.push({ id: this.nextNewIdRoleConsortia--, consortiumName: x, roleName: 'general' });
      });
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
