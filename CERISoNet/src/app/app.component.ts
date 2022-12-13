import { Component, OnInit } from '@angular/core';
import { AuthService } from "./services/auth.service";
import { StorageService } from "./services/storage.service";
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
    private auth: AuthService,
    private storage: StorageService,
    private router: Router,
  ) {}

  ngOnInit(): void
  {
    this.home();
  }

  home()
  {
    if (this.userConnected())
    {
      this.router.navigateByUrl('')
    }
    else
    {
      this.router.navigateByUrl('login')
    }
  }

  // Récupération du token afin de vérifier la connexion de l'utilisateur
  userConnected()
  {
    return this.storage.getToken();
  }

  // Permet de déconnecter l'utilisateur
  logout()
  {
    this.auth.logout();
    this.router.navigateByUrl('login');
  }
}
