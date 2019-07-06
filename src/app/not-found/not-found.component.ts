import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { AuthService} from '../services/auth.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  constructor(private router: Router, private auth: AuthService) { }

  ngOnInit() {
  }

  gotoDocs() {
    this.router.navigateByUrl('/docs');
  }

  gotoHome() {
    this.router.navigateByUrl('/bucketlists');
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

}
