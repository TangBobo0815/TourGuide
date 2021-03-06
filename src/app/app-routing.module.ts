import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'home',loadChildren: './home/home.module#HomePageModule' },
  { path: 'home/:uid',loadChildren: './home/home.module#HomePageModule' },
  { path: 'list',loadChildren: './list/list.module#ListPageModule' }, 
  { path: 'package', loadChildren: './package/package.module#PackagePageModule' },
  { path: 'signup', loadChildren: './signup/signup.module#SignupPageModule' },
  { path: 'notifications', loadChildren: './notifications/notifications.module#NotificationsPageModule' },
  { path: 'setting', loadChildren: './setting/setting.module#SettingPageModule' },
  { path: 'setting/:uid', loadChildren: './setting/setting.module#SettingPageModule' },
  { path: 'getpasswd', loadChildren: './getpasswd/getpasswd.module#GetpasswdPageModule' },
  { path: 'profile/:uid', loadChildren: './profile/profile.module#ProfilePageModule' },
  { path: 'profile', loadChildren: './profile/profile.module#ProfilePageModule' },
  { path: 'userpack', loadChildren: './userpack/userpack.module#UserpackPageModule' },
  { path: 'update-userdata', loadChildren: './update-userdata/update-userdata.module#UpdateUserdataPageModule' },
  { path: 'join', loadChildren: './join/join.module#JoinPageModule' },
  { path: 'join/:uid', loadChildren: './join/join.module#JoinPageModule' },
  { path: '', loadChildren: './order/order.module#OrderPageModule' },
  { path: 'star', loadChildren: './star/star.module#StarPageModule' },
  { path: 'star/:uid', loadChildren: './star/star.module#StarPageModule' },
  { path: 'attend', loadChildren: './attend/attend.module#AttendPageModule' },
  { path: 'favorite', loadChildren: './favorite/favorite.module#FavoritePageModule' },
  { path: 'details', loadChildren: './details/details.module#DetailsPageModule' },
  { path: 'details/:uid', loadChildren: './details/details.module#DetailsPageModule' },
  { path: 'star-p', loadChildren: './star-p/star-p.module#StarPPageModule' },
  { path: 'star-p/:uid', loadChildren: './star-p/star-p.module#StarPPageModule' },
  { path: 'attend-null', loadChildren: './attend-null/attend-null.module#AttendNullPageModule' },
  ]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
