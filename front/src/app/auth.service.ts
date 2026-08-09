import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authApiUrl = environment.authApiUrl;

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.authApiUrl}/login`, { username, password });
  }

  register(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.authApiUrl}/register`, { username, password });
  }

  saveSession(response: any): void {
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(USER_KEY, JSON.stringify({ username: response.username, role: response.role }));
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  get token(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  get isAuthenticated(): boolean {
    return !!this.token;
  }

  get username(): string | null {
    const user = localStorage.getItem(USER_KEY);
    return user ? (JSON.parse(user) as any).username : null;
  }

  get role(): string | null {
    const user = localStorage.getItem(USER_KEY);
    return user ? (JSON.parse(user) as any).role : null;
  }
}
