import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewentryPage } from './newentry.page';

const routes: Routes = [
  {
    path: '',
    component: NewentryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewentryPageRoutingModule {}
