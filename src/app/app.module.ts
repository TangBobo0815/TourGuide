import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

//----------------------------
import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuth } from "@angular/fire/auth";
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { FirestoreSettingsToken} from '@angular/fire/firestore';
import { MatProgressBarModule} from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
//import { IonicStepperModule } from 'ionic-stepper';

//----------------------------
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
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
