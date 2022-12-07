import { Component, OnInit } from '@angular/core';
import { AuthService } from "./services/auth.service";
import { StorageService } from "./services/storage.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit
{
  title = 'CERISoNet';

  constructor(
    private auth: AuthService,
    private storage: StorageService,
  ) {}

  ngOnInit(): void
  {}

  // Récupération du token afin de vérifier la connexion de l'utilisateur
  userConnected()
  {
    return this.storage.getToken();
  }

  // Permet de déconnecter l'utilisateur
  logout()
  {
    this.auth.logout();
  }
}
