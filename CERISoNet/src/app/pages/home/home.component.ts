import { Component, OnInit } from '@angular/core';
import { StorageService } from "../../services/storage.service";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  constructor(private storage: StorageService,
              private  auth: AuthService,
              private router: Router) {}

  ngOnInit(): void {}

  // Permet de récupérer le username de l'utilisateur
  getUsername()
  {
    if (this.storage.getUserDetails())
    {
      return this.storage.getUserDetails()._identifiant;
    }
    else
    {
      return null;
    }
  }
}
