import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PanicPage } from './panic.page';

const routes: Routes = [
  {
    path: '',
    component: PanicPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PanicPageRoutingModule { }
