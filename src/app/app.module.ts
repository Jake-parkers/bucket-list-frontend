import { BrowserModule } from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { DocsComponent } from './docs/docs.component';
import {ReactiveFormsModule} from '@angular/forms';

import { AuthService } from './services/auth.service';
import { BucketListService } from './services/bucket-list.service';
import { ItemService } from './services/item.service';
import { MiscService } from './services/misc.service';
import {HttpInterceptorService} from './interceptor/http-interceptor.service';
import { NotFoundComponent } from './not-found/not-found.component';
import { LoaderComponent } from './loader/loader.component';
import { BucketComponent } from './bucket/bucket.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    DocsComponent,
    NotFoundComponent,
    LoaderComponent,
    BucketComponent
  ],
  entryComponents: [LoaderComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true  },
    AuthService,
    BucketListService,
    ItemService,
    MiscService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
