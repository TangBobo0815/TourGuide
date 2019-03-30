import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { GetpasswdPage } from './getpasswd.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: GetpasswdPage
      }
    ])
  ],
  declarations: [GetpasswdPage]
})
export class GetpasswdPageModule {
  
}
