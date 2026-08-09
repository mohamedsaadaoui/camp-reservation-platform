import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapComponent } from './map/map.component';
import { LoginComponent } from './login/login.component';
import { BackofficeComponent } from './backoffice/backoffice.component';
import { AdminGuard } from './admin.guard';

const routes: Routes = [
  { path: '', redirectTo: '/map', pathMatch: 'full' },
  { path: 'map', component: MapComponent },

  { path: 'login', component: LoginComponent },
  { path: 'backoffice', component: BackofficeComponent, canActivate: [AdminGuard] },
  { path: '**', redirectTo: '/map' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
