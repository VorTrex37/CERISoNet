import { Component, OnInit } from '@angular/core';
import { NgForm   } from '@angular/forms';
import { ApiService } from '../../services/api.service'
import { AuthService } from '../../services/auth.service'
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NotifierService } from "angular-notifier";
import { environment } from '../../../environments/environment';
import { DatePipe } from "@angular/common";



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [ DatePipe ]
})
export class LoginComponent implements OnInit
{
  isLogin: boolean = false
  errorMessage: any
  baseUrl = environment.baseUrl;


  constructor(
    private http: HttpClient,
    private _api: ApiService,
    private _auth: AuthService,
    private _router: Router,
    private notifier: NotifierService,
    private datePipe: DatePipe
  ) {}

  ngOnInit()
  {
    this.isUserLogin();
  }

  // Permet de connecter l'utilisateur
  onSubmit(form: NgForm)
  {
    try
    {
      console.log('Your form data : ', form.value);
        // Envoie une requête Http POST avec les données du formulaire (username et password)
        this._api.postTypeRequest('login', form.value).subscribe(
          //Réception et Gestion des réponses valides
          (res: any) =>
      {
        console.log(res);

        if (res.data && res.token)
        {
          const username = res.data._identifiant;

          // Ajout des données de l'utilisateur dans le localStorage
          this._auth.setDataInLocalStorage('userData', JSON.stringify(res.data));
          // Ajout du token dans le localStorage
          this._auth.setDataInLocalStorage('token', res.token);
          // Ajout de la dernière connexion dans le localStorage
          this._auth.setDataInLocalStorage('connectionLastDate_'+ username, this._auth.verifLastConnectionDate(username));
          // Ajout de la connexion actuel dans le localStorage
          this._auth.setDataInLocalStorage('connectionCurrentDate_'+ username,  new Date());

          // Redirection vers la page principale
          this._router.navigate(['']);

          const lastDate = this._auth.getConnectionLastDate();

          // Affiche une notification de type success une fois la connexion réussi
          this.showNotification( 'success', 'Connexion réussie !');

          // Affiche une notification de type info pour montrer la date de dernière connexion à l'utilisateur
          this.showNotification( 'info', 'Dernière connexion : ' + this.datePipe.transform(lastDate, 'dd/MM/yyyy HH:mm::ss', 'fr'));
        }
      },
          //Réception et Gestion des réponses erreurs
      (error: any) => {
        console.log(error);
        // Affiche une notification de type warning pour une erreur 400
        if (error.status == '400')
        {
          this.showNotification( 'warning', error.error.message );
        }
        // Affiche une notification de type error pour une erreur 401
        if (error.status == '401')
        {
          this.showNotification( 'error', error.error.message );
        }
      })
    }
    catch (e)
    {
      console.log(e);
    }
  }

  // Vérifie si un utilisateur est connecté grâce au localStorage
  isUserLogin()
  {
    const userData = this._auth.getUserDetails();

    if(userData)
    {
      this.isLogin = true;
      this._router.navigate([''])
    }
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
}
