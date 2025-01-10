import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewentryPageRoutingModule } from './newentry-routing.module';

import { NewentryPage } from './newentry.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewentryPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [NewentryPage]
})
export class NewentryPageModule {}
