import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { JoinPage } from './join.page';
import { StarRatingModule } from 'ionic4-star-rating';


const routes: Routes = [
  {
    path: '',
    component: JoinPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StarRatingModule,
    RouterModule.forChild(routes)
  ],
  declarations: [JoinPage]
})
export class JoinPageModule {}
