import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { PlaceOrderComponent } from './Customer/place-order/place-order.component';
import { UploadHerdComponent } from './Shepherd/upload-herd/upload-herd.component';
import { ConfirmationScreenComponent } from './Customer/confirmation-screen/confirmation-screen.component';

const appRoutes: Routes = [
    { path:"login", component: LoginComponent},
    { path:"register", component: RegisterComponent},
    { path:"uploadHerd", component: UploadHerdComponent},
    { path:"placeorder", component: PlaceOrderComponent},
    { path:"confirmation", component: ConfirmationScreenComponent},
    { path:"", component: HomeComponent}
];
@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule {

}