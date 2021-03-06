import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { StarRatingModule } from 'ionic4-star-rating';
import { StarPPage } from './star-p.page';

const routes: Routes = [
  {
    path: '',
    component: StarPPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    StarRatingModule,
    RouterModule.forChild(routes)
  ],
  declarations: [StarPPage]
})
export class StarPPageModule {}
