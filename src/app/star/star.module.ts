import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicRatingModule } from "ionic4-rating";
import { IonicModule } from '@ionic/angular';
import { StarRatingModule } from 'ionic4-star-rating';

import { StarPage } from './star.page';

const routes: Routes = [
  {
    path: '',
    component: StarPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    IonicRatingModule,
    StarRatingModule,
    ReactiveFormsModule
  ],
  declarations: [StarPage]
})
export class StarPageModule {}
