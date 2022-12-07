import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  // Permet de récupérer les datas de l'utilsateur qui sont dans le localStorage
  getUserDetails()
  {
    const userData = localStorage.getItem('userData');

    if(userData)
    {
      return JSON.parse(userData);
    }
    else
    {
      return null;
    }
  }

  // Permet de récupérer le token de l'utilsateur qui est dans le localStorage
  getToken()
  {
    const token = localStorage.getItem('token');

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
    const userData = localStorage.getItem('userData');

    if (userData)
    {
      const currentDate = localStorage.getItem('connectionCurrentDate_' + JSON.parse(userData)._identifiant);

      if(currentDate != 'Première connexion' && currentDate != null)
      {
        return Date.parse(currentDate);
      }
      else
      {
        return currentDate;
      }
    }
    else
    {
      return null;
    }
  }

  // Permet de récupérer la dernière date de connexion de l'utilsateur qui est dans le localStorage
  getConnectionLastDate()
  {
    const userData = localStorage.getItem('userData');

    if (userData)
    {
      const lastDate = localStorage.getItem('connectionLastDate_' + JSON.parse(userData)._identifiant);

      if(lastDate != 'Première connexion' && lastDate != null)
      {
        return JSON.parse(lastDate);
      }
      else
      {
        return lastDate;
      }
    }
    else
    {
      return null
    }
  }

  // Permet de vérifier si l'utilisateur s'est déjà connecté
  // Set la dernière date de connexion
  verifLastConnectionDate(username : string)
  {
    const lastConnectionDate = localStorage.getItem('connectionLastDate_' + username);
    const currentConnectionDate = localStorage.getItem('connectionCurrentDate_' + username);

    if (lastConnectionDate && currentConnectionDate)
    {
      return currentConnectionDate;
    }
    else
    {
      return 'Première connexion';
    }

  }
}
