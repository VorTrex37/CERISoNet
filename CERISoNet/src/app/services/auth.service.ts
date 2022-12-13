import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { User } from "../auth/user";
import { AuthResponse } from "../auth/auth-response";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { tap } from 'rxjs/operators';
import { StorageService } from "./storage.service";


@Injectable({
  providedIn: 'root',
})

export class AuthService {
  baseURL = environment.baseURL;
  isLogged: boolean = false

  constructor(private httpClient: HttpClient,
              private router: Router,
              private storage: StorageService) { }

  // Permet de connecter l'utilisateur
  login(user: User) : Observable<AuthResponse> {
      // Envoie une requête Http POST avec les données du formulaire (username et password)
      return this.httpClient.post<AuthResponse>(`${this.baseURL}login`, user).pipe(tap(
        //Réception et Gestion des réponses valides
        async (res: AuthResponse) => {
          if (res.data && res.token) {
            const username = res.data._identifiant;

            // Ajout des données de l'utilisateur dans le localStorage
            localStorage.setItem('userData', JSON.stringify(res.data));
            // Ajout du token dans le localStorage
            localStorage.setItem('token', res.token);
            // Ajout de la dernière connexion dans le localStorage
            localStorage.setItem('connectionLastDate_' + username, this.storage.verifLastConnectionDate(username));
            // Ajout de la connexion actuel dans le localStorage
            localStorage.setItem('connectionCurrentDate_' + username, JSON.stringify(new Date()));
          }
        })
      )
  }

  // Permet de déconnecter l'utilisateur en supprimant les datas de l'utilisateur et le token du localStorage
  async logout() {
    await localStorage.removeItem('token');
    await  localStorage.removeItem('userData');
  }

  // Vérifie si un utilisateur est connecté
  isLoggedIn() {
    const userData = this.storage.getUserDetails();

    if(userData)
    {
      this.router.navigateByUrl('')
      return true;
    }
    else {
      return  false;
    }
  }
}
