import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { MiscService } from '../services/misc.service';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

// tslint:disable-next-line:max-line-length
const emailRegexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  email: AbstractControl;
  password: AbstractControl;
  loggingIn = false;
  checkCircle = faCheckCircle;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private misc: MiscService,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      this.router.navigateByUrl('/bucketlists');
    }
    this.loginForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegexp)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(4)])]
    });
    this.email = this.loginForm.controls.email;
    this.password = this.loginForm.controls.password;
  }

  login() {
    this.loggingIn = true;
    this.auth.login(this.loginForm.value)
      .subscribe(response => {
        this.loggingIn = false;
        if (response.status === 'success') {
          this.router.navigateByUrl('/bucketlists');
        } else {
          this.misc.showAlert(response.message);
          this.router.navigateByUrl('/not-found');
        }
      }, error => {
        this.loggingIn = false;
        this.misc.showAlert(error.message);
      });
  }

  gotoSignUp() {
    this.router.navigateByUrl('/register');
  }

}
