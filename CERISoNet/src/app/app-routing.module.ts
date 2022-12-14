import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { LoginComponent } from "./auth/login/login.component";
import {FeedbackComponent} from "./pages/feedback/feedback.component";

const routes: Routes = [
  { path: '', component: FeedbackComponent },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
