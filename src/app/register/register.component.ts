import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { MiscService } from '../services/misc.service';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

// tslint:disable-next-line:max-line-length
const emailRegexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  email: AbstractControl;
  password: AbstractControl;
  registering = false;
  checkCircle = faCheckCircle;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private misc: MiscService,
    private router: Router
  ) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegexp)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(4)])]
    });
    this.email = this.registerForm.controls.email;
    this.password = this.registerForm.controls.password;
  }

  register() {
    this.registering = true;
    this.auth.register(this.registerForm.value)
      .subscribe(response => {
        this.registering = false;
        if (response.status === 'success') {
          this.misc.showAlert('Account Successfully Created');
          this.router.navigateByUrl('/login');
        } else {
          this.misc.showAlert(response.message);
          this.router.navigateByUrl('/not-found');
        }
      }, error => {
        this.registering = false;
        this.misc.showAlert(error.message);
      });
  }

  gotoLogin() {
    this.router.navigateByUrl('/login');
  }

}
