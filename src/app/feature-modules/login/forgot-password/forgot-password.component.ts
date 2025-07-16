import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first, finalize } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.css'],
    standalone: false
})
export class ForgotPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';
  message = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService
  ) { }

  // convenience getter for easy access to form fields
  get f() { return this.resetPasswordForm.controls; }

  ngOnInit(): void {
    this.resetPasswordForm = this.formBuilder.group({
      userName: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.resetPasswordForm.invalid) {
        return;
    }

    this.loading = true;
    this.authenticationService.forgotPassword(this.f.userName.value)
        .pipe(first())
        .pipe(finalize(() => this.loading = false))
        .subscribe({
          next: () => this.message = 'Please check your email for password reset instructions',
          error: error => this.error = error
        });
  }

}
