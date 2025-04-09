import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    url = 'http://localhost/mapadeltesoro/Backend/auth.php';
  constructor( private http: HttpClient) { }
  

  login(username: string, password: string) {
    return this.http.post(`${this.url}`, { username, password });
  }
  register(username: string, email: string, password: string) {
    return this.http.post(`${this.url}`, { username, email, password });
  }

}