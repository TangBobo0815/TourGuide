import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { StarRatingModule } from 'ionic4-star-rating';

import { HomePage } from './home.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StarRatingModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      },
    ])
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
