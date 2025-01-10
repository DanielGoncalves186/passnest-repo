import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { NewsubPageRoutingModule } from './newsub-routing.module';

import { NewsubPage } from './newsub.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewsubPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [NewsubPage]
})
export class NewsubPageModule {}
