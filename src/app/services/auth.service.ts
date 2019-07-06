import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Response} from '../response';
import {environment} from '../../environments/environment';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  static getToken() {
    return localStorage.getItem(environment.key);
  }

  login(payload) {
    return this.http.post<Response>(environment.apiUrl + 'auth/login', payload)
      .pipe(
        tap(response => {
          localStorage.setItem(environment.key, response.message.token);
        })
      );
  }

  isAuthenticated() {
    return localStorage.getItem(environment.key) !== null;
  }

  logout() {
    return localStorage.removeItem(environment.key);
  }

  register(payload) {
    return this.http.post<Response>(environment.apiUrl + 'auth/register', payload);
  }
}
