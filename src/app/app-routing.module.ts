import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppResolver } from './app-resolver.service';

const routes: Routes = [
  { path: '', redirectTo: 'secure', pathMatch: 'full', resolve: { 'themeData': AppResolver } },
  { path: 'secure', loadChildren: () => import('./secure/secure.module').then(m => m.SecureModule), resolve: { 'themeData': AppResolver } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
