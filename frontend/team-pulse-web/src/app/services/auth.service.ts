import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://3.15.18.189:3000/auth';
  private tokenKey = 'token';

  constructor(private http: HttpClient) {}

  // auth.service.ts (Angular)
  login(username: string, password: string) {
    return this.http.post<{ access_token: string }>('http://3.15.18.189:3000/auth/login', { username, password })
    .pipe(tap(res => localStorage.setItem('token', res.access_token)));
  }

  signup(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, { username, password });
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
}
