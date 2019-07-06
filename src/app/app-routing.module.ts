import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {DocsComponent} from './docs/docs.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {BucketComponent} from './bucket/bucket.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'docs'},
  {path: 'bucketlists', component: HomeComponent},
  {path: 'bucketlists/:bucket_id', component: BucketComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'docs', component: DocsComponent},
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
