import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { FeedbackComponent } from './pages/feedback/feedback.component';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { LOCALE_ID } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {NgxPaginationModule} from "ngx-pagination";
import { SocketIoModule } from 'ngx-socket-io';
import { environment } from "../environments/environment";


// the second parameter 'fr' is optional
registerLocaleData(localeFr, 'fr');

const customNotifierOptions: NotifierOptions = {
  position: {
    horizontal: {
      //Defines the horizontal position on the screen
      position: 'right',
    },
    vertical: {
      // Defines the vertical position on the screen
      position: 'top',
      distance: 80
    }
  }
};

@NgModule({
  declarations: [
    AppComponent,
    FeedbackComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        RouterModule,
        HttpClientModule,
        NotifierModule.withConfig(customNotifierOptions),
        AuthModule,
        ReactiveFormsModule,
        FormsModule,
        NgbModule,
        NgxPaginationModule,
        SocketIoModule.forRoot({ url: environment.baseURL, options: {} })
    ],
  providers: [{provide: LOCALE_ID, useValue: 'fr' }],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
