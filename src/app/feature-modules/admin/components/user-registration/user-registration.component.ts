import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { User } from 'src/app/core/model/user/user';
import { UserService } from 'src/app/core/services/user.service';
import { first } from 'rxjs/operators';
import { EntityValues } from '../../model/entity-values';
import { ManagedListsService } from 'src/app/feature-modules/services/managed-lists.service';
import { LoggedUserService, LoggedUser } from 'src/app/core';

export class WorkUnitRole {
  workUnitName: string;
  roleName: string;
}

export class ConsortiumRole {
  consortiumName: string;
  roleName: string;
}

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
  user: User;

  workUnits: NamedValue[] = [];
  roles: NamedValue[] = [];
  consortia: NamedValue[] = [];

  selectedWorkUnits: string;
  selectedConsortia: string;

  listsByUser: EntityValues[];

  workUnitRoles: WorkUnitRole[] = [];
  consortiumRoles: ConsortiumRole[] = [];

  canSetRoles = false;

  // name = new FormControl('', [Validators.required]);


  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private managedListsService: ManagedListsService,
    private loggedUserService: LoggedUserService) { }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      name: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    this.loggedUserService.getLoggerUser().subscribe((data: LoggedUser) =>
      this.canSetRoles = !data.admin);

    this.managedListsService.getManagedListsByUser().subscribe(data => {
      this.listsByUser = data;
      this.initLists();
    });

    this.addWorkUnitRole();
    this.addConsortiumRole();
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
    console.log('this.signupForm', this.signupForm);

    // stop here if form is invalid
    if (this.signupForm.invalid) {
      console.log('Invalid form!');
      return;
    }

    this.loading = true;
    this.user = {
      name: this.f.name.value,
      password: this.f.password.value,
      email: this.f.email.value,
      workUnitName: this.f.workUnit.value[0],
      instituteName: this.f.institute.value,
      roleName: this.f.role.value[0]
    };
    console.log('user: ', this.user);
    this.userService.createUser(this.user)
      .pipe(first())
      .subscribe(
        data => {
          this.loading = false;
        },
        error => {
          this.error = error;
          this.loading = false;
          console.log('error: ', this.error);
        });
  }

  getEmailErrorMessage() {
    return this.f.email.hasError('required') ? 'You must enter a value' :
      this.f.email.hasError('email') ? 'Not a valid email' :
        '';
  }

  addWorkUnitRole() {
    this.workUnitRoles.push(new WorkUnitRole());
  }

  addConsortiumRole() {
    this.consortiumRoles.push(new ConsortiumRole());
  }

  deleteWorkUnitRole() {

  }

  deleteConsortiumRole() {

  }
}
