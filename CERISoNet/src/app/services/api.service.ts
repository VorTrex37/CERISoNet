import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // L'URL est une variable d'environnement
  baseUrl = environment.baseUrl;

  constructor(private _http: HttpClient) {
  }

  // Permet d'envoyer une requête HTTP GET
  getTypeRequest(url: any) {
    return this._http.get(`${this.baseUrl}${url}`).pipe(map(res => {
      return res;
    }));
  }

  // Permet d'envoyer une requête HTTP POST
  postTypeRequest(url : any, payload : any) {
    return this._http.post(`${this.baseUrl}${url}`, payload).pipe(map(res => {
      return res;
    }));
  }
}
