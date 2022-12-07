import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service'
import { Router } from '@angular/router';
import { DatePipe } from "@angular/common";
import { NotifierService } from "angular-notifier";
import { StorageService } from "../../services/storage.service";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [ DatePipe ]
})
export class LoginComponent implements OnInit
{
  constructor(
    private  auth:  AuthService,
    private  router:  Router,
    private datePipe: DatePipe,
    private storage: StorageService,
    private notifier: NotifierService) {}

  ngOnInit()
  {
    this.userIsLogged();
  }

  login({form}: { form: any }){
    try {
      console.log('Your form data : ', form.value);
      this.auth.login(form.value).subscribe(( res)=>{
        console.log(res);

        this.router.navigateByUrl('');

        // Affiche le bandeau de notification
        this.sendNotificationSuccess();
      },
      //Réception et Gestion des réponses erreurs
      (error: any) => {
        console.log(error);

        this.sendNotificationError(error);
      });
    }
    catch (e) {
      console.log(e);
    }
  }

  userIsLogged ()
  {
    return this.auth.isLoggedIn();
  }

  /**
   * Affiche une notification
   *
   * @param {string} type    Notification type
   * @param {string} message Notification message
   */
  public showNotification( type: string, message: string ): void {
    this.notifier.notify( type, message );
  }

  // Affiche une notification en fonction de la dernière date de connexion
  public sendNotificationSuccess(): void
  {
    const lastDate = this.storage.getConnectionLastDate();

    // Affiche une notification de type success une fois la connexion réussi
    this.showNotification( 'success', 'Connexion réussie !');

    if (lastDate == "Première connexion")
    {
      // Affiche une notification de type info pour montrer la première connexion à l'utilisateur
      this.showNotification( 'info', 'Dernière connexion : ' +  lastDate);
    } else{
      // Affiche une notification de type info pour montrer la date de dernière connexion à l'utilisateur
      this.showNotification( 'info', 'Dernière connexion : ' + this.datePipe.transform(lastDate, 'dd/MM/yyyy HH:mm::ss', 'fr'));
    }
  }

  // Affiche une notification en fonction de la dernière date de connexion
  public sendNotificationError(error :any): void
  {
    // Affiche une notification de type warning pour une erreur 400
    if (error.status == '400') {
      this.showNotification('warning', error.error.message);
    }
    // Affiche une notification de type error pour une erreur 401
    if (error.status == '401') {
      this.showNotification('error', error.error.message);
    }
  }
}
