import {Component, OnInit} from '@angular/core';
import {AuthService} from "./services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit
{
  title = 'CERISoNet';

  constructor(
    private _auth: AuthService,
    private _router: Router,
  ) {}

  ngOnInit(): void
  {}

  // Récupération du token afin de vérifier la connexion de l'utilisateur
  userConnected()
  {
    return this._auth.getToken();
  }

  // Permet de déconnecter l'utilisateur
  logout()
  {
    this._auth.logout();
  }
}
