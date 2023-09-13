import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { RegistrationListComponent } from './registration-list/registration-list.component';
import { UserDetailsComponent } from './user-details/user-details.component';

const routes: Routes = [
  {
   path:'',
   redirectTo:'register',
   pathMatch:'full'
  },
  {
    path:'register',
    component: RegistrationComponent
  },
  {
    path:'list',
    component:RegistrationListComponent
  },
  {
    path:'detail/:id',
    component:UserDetailsComponent
  },
  {
    path:'update/:id',
    component:RegistrationComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
