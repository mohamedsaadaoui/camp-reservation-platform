import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapComponent } from './map/map.component';
import { LoginComponent } from './login/login.component';
import { BackofficeComponent } from './backoffice/backoffice.component';
import { CardsComponent } from './cards/cards.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminGuard } from './admin.guard';

const routes: Routes = [
  { path: '', redirectTo: '/cards', pathMatch: 'full' },
  { path: 'cards', component: CardsComponent },
  { path: 'map', component: MapComponent },

  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AdminGuard] },
  { path: 'backoffice', component: BackofficeComponent, canActivate: [AdminGuard] },
  { path: '**', redirectTo: '/cards' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
