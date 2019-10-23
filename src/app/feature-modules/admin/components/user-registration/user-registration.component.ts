import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/core/model/user/user';
import { ConfigurationData } from 'src/app/core/model/conf/configuration-data';
import { UserService } from 'src/app/core/services/user.service';
import { ConfigurationDataService } from 'src/app/core/services/configuration-data.service';
import { first } from 'rxjs/operators';
import { Subscription, Observable } from 'rxjs';
import { EntityValues } from '../../model/entity-values';
import { ManagedListsService } from 'src/app/feature-modules/services/managed-lists.service';

export class WorkUnitRole {
  workUnitName: string;
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
  returnUrl: string;
  error = '';
  user: User;
  workUnits: NamedValue[] = [];
  institutes: NamedValue[] = [];
  roles: NamedValue[] = [];

  configurationData: ConfigurationData;

  workUnitRoles: WorkUnitRole[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private configurationService: ConfigurationDataService,
    private managedListsService: ManagedListsService) { }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      name: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', Validators.required],
      workUnit: ['', Validators.required],
      institute: ['', Validators.required],
      role: ['', Validators.required]
    });

    this.managedListsService.getManagedListsByUser().subscribe(data => {
      console.log('data:', data);
      
    });

   // const workUnitRole = new WorkUnitRole();
    
    this.workUnitRoles.push(new WorkUnitRole());
    this.workUnitRoles.push(new WorkUnitRole());

    this.configurationService.getConfigurationData().subscribe(data => {
      this.configurationData = data;
      this.workUnits = this.configurationData.workUnits.map(x => { return { name: x } });
      this.institutes = this.configurationData.institutes.map(x => { return { name: x } });
    });
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
