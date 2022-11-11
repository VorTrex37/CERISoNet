import { Component, OnInit } from '@angular/core';
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  constructor(private _auth: AuthService) {}

  ngOnInit(): void {
  }

  // Permet de récupérer le username de l'utilisateur
  getUsername()
  {
    const userData = this._auth.getUserDetails();

    if (userData)
    {
      return  JSON.parse(userData)._identifiant;
    }
    else
    {
      return null;
    }
  }
}
