import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { PopoverComponent } from './popover/popover.component';

//----------------------------
import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFireAuthModule } from 'angularfire2/auth';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { FirestoreSettingsToken} from '@angular/fire/firestore';
import { MatProgressBarModule} from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { JoinPage } from './join/join.page';
import { JoinPageModule } from './join/join.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
//import { IonicStepperModule } from 'ionic-stepper';


//----------------------------
@NgModule({
  declarations: [AppComponent, PopoverComponent],
  entryComponents: [PopoverComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFirestoreModule,
    BrowserAnimationsModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AngularFireAuth,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: FirestoreSettingsToken, useValue: {} }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
