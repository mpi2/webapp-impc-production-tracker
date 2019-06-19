import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User, WorkUnit, Institute, Role } from 'src/app/_models';
import { UserService, WorkUnitService, InstituteService, RoleService } from 'src/app/_services';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  signupForm: FormGroup;

  dropdownSettingsWorkUnit = {};
  dropdownSettingsInstitute = {};
  dropdownSettingsRole = {};

  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';
  user: User;
  workUnits: WorkUnit[] = [];
  institutes: Institute[] = [];
  roles: Role[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private workUnitService: WorkUnitService,
    private instituteService: InstituteService,
    private roleService: RoleService) { }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      name: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', Validators.required],
      workUnit: ['', Validators.required],
      institute: ['', Validators.required],
      role: ['', Validators.required]
    });

    this.workUnitService.getAll().pipe(first()).subscribe(workUnits => {
      this.workUnits = workUnits['_embedded']['workUnits'];
      console.log('workUnits: ', this.workUnits);
    });

    this.instituteService.getAll().pipe(first()).subscribe(institutes => {
      this.institutes = institutes['_embedded']['institutes'];
      console.log('institutes: ', this.institutes);
    });

    this.roleService.getAll().pipe(first()).subscribe(roles => {
      this.roles = roles['_embedded']['roles'];
      console.log('roles: ', this.roles);
    });

    this.dropdownSettingsWorkUnit = {
      singleSelection: true,
      idField: 'ilarCode',
      textField: 'ilarCode',
      enableCheckAll: false,
      allowSearchFilter: true
    };

    this.dropdownSettingsInstitute = {
      singleSelection: false,
      idField: 'name',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true
    };

    this.dropdownSettingsRole = {
      singleSelection: true,
      idField: 'name',
      textField: 'name',
      enableCheckAll: false,
      allowSearchFilter: true
    };
  }

  // convenience getter for easy access to form fields
  get f() { return this.signupForm.controls; }

  onSubmit() {
    this.submitted = true;

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

}