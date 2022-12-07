import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { HomeComponent } from './pages/home/home.component';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { CommentsComponent } from './pages/comments/comments.component';

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
    HomeComponent,
    CommentsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    NotifierModule.withConfig(customNotifierOptions),
    AuthModule
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
