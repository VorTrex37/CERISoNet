import { Injectable } from '@angular/core';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _router: Router) { }

  // Permet de récupérer les datas de l'utilsateur qui sont dans le localStorage
  getUserDetails()
  {
    const userData = this.getDataInLocalStorage('userData');

    if(userData)
    {
      return userData
    }
    else
    {
      return null;
    }
  }

  // Permet d'ajouter un item dans le localStorage
  setDataInLocalStorage(variableName: any, data: any)
  {
    localStorage.setItem(variableName, data);
  }

  // Permet de récupérer un item du le localStorage
  getDataInLocalStorage(variableName: any)
  {
    return localStorage.getItem(variableName);
  }

  // Permet de récupérer le token de l'utilsateur qui est dans le localStorage
  getToken()
  {
    const token = this.getDataInLocalStorage('token');

    if(token)
    {
      return token
    }
    else
    {
      return null;
    }
  }

  // Permet de récupérer la date de connexion de l'utilsateur qui est dans le localStorage
  getConnectionCurrentDate()
  {
    const userData = this.getDataInLocalStorage('userData');

    if (userData)
    {
      return this.getDataInLocalStorage('connectionCurrentDate_' + JSON.parse(userData)._identifiant);
    }
    else
    {
      return null;
    }
  }

  // Permet de récupérer la dernière date de connexion de l'utilsateur qui est dans le localStorage
  getConnectionLastDate()
  {
    const userData = this.getDataInLocalStorage('userData');

    if (userData)
    {
      return this.getDataInLocalStorage('connectionLastDate_' + JSON.parse(userData)._identifiant);
    } else
    {
      return null;
    }
  }

  // Permet de vérifier si l'utilisateur s'est déjà connecté
  // Set la dernière date de connexion
  verifLastConnectionDate(username : any)
  {
    const lastConnectionDate = this.getDataInLocalStorage('connectionLastDate_' + username);
    const currentConnectionDate = this.getDataInLocalStorage('connectionCurrentDate_' + username);

    if (lastConnectionDate && currentConnectionDate)
    {
      return currentConnectionDate;
    }
    else
    {
      return 'Première connexion';
    }

  }

  // Permet de supprimer un item dans le localStorage
  removeDataInLocalStorage(variableName: any)
  {
    localStorage.removeItem(variableName);
  }

  // Permet de déconnecter l'utilisateur en supprimant les datas de l'utilisateur et le token du localStorage
  logout ()
  {
    this.removeDataInLocalStorage('userData');
    this.removeDataInLocalStorage('token');
    this._router.navigate([''])
  }
}
