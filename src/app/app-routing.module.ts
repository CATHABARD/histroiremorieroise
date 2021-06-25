import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { UserDatasComponent } from './auth/user-datas/user-datas.component';

const routes: Routes = [
  { path: 'app-accueil', component: AccueilComponent },
  { path: 'app-sign-in', component: SignInComponent},
  { path: 'app-sign-UP', component: SignUpComponent},
  { path: 'app-user-data', component: UserDatasComponent},
  { path: '', redirectTo: 'app-accueil', pathMatch: 'full' },
  { path: '**', redirectTo: 'app-accueil' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
