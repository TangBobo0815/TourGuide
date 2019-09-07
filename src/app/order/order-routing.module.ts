import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderPage } from './order.page';

const routes: Routes = [
  {
    path: 'order',
    component: OrderPage,
    children:
      [
        {
          path: 'tab1',
          children:
            [
              {
                path: '',
                loadChildren: '../tab1/tab1.module#Tab1PageModule'
              }
            ]
        },
        {
            path: 'tab2',
            children:
              [
                {
                  path: '',
                  loadChildren: '../tab2/tab2.module#Tab2PageModule'
                }
              ]
          },
          {
            path: '',
            redirectTo: '/order/tab1',
            pathMatch: 'full'
          }
        ]
    },
    {
      path: '',
      redirectTo: '/order/tab1',
      pathMatch: 'full'
    }
  ];
  @NgModule({
    imports:
      [
        RouterModule.forChild(routes)
      ],
    exports:
      [
        RouterModule
      ]
  })
  export class OrderPageRoutingModule {}