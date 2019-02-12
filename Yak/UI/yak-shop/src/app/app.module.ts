import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { UploadHerdComponent } from './Shepherd/upload-herd/upload-herd.component';
import { StatusComponent } from './Shared/status/status.component';
import { PlaceOrderComponent } from './Customer/place-order/place-order.component';
import { ConfirmationScreenComponent } from './Customer/confirmation-screen/confirmation-screen.component';
import { AppDataService } from './Shared/services/app-data.service';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    UploadHerdComponent,
    StatusComponent,
    PlaceOrderComponent,
    ConfirmationScreenComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [
    AppDataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
