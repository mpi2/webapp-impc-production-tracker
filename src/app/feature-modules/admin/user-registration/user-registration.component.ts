import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/core/model/user/user';
import { ConfigurationData } from 'src/app/core/model/conf/configuration-data';
import { UserService } from 'src/app/core/services/user.service';
import { ConfigurationDataService } from 'src/app/core/services/configuration-data.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent implements OnInit {
  signupForm: FormGroup;

  dropdownSettingsWorkUnit = {};
  dropdownSettingsInstitute = {};
  dropdownSettingsRole = {};

  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';
  user: User;
  workUnits: string[] = [];
  institutes: string[] = [];
  roles: string[] = [];

  configurationData: ConfigurationData;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private configurationService: ConfigurationDataService) { }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      name: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', Validators.required],
      workUnit: ['', Validators.required],
      institute: ['', Validators.required],
      role: ['', Validators.required]
    });

    this.configurationService.getConfigurationData().subscribe(data => {
      this.configurationData = data;
      this.workUnits = this.configurationData.workUnits;
      this.institutes = this.configurationData.institutes;
      this.roles = this.configurationData.roles;
    });

    this.dropdownSettingsWorkUnit = {
      singleSelection: true,
      idField: 'name',
      textField: 'name',
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
