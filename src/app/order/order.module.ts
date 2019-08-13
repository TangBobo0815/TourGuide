import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { OrderPageRoutingModule } from './order-routing.module';

import { IonicModule } from '@ionic/angular';

import { OrderPage } from './order.page';

const routes: Routes = [
  {
    path: '',
    component: OrderPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    OrderPageRoutingModule
  ],
  declarations: [OrderPage]
})
export class OrderPageModule {}
