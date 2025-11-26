import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Update {
  userId: string;
  tasks: string;
  blockers?: string;
  priority?: number;
  mood?: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UpdatesService {
  private apiUrl = 'http://localhost:3000/updates';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): { headers: HttpHeaders } {
    const token = this.authService.getToken();
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  postUpdate(update: Update): Observable<Update> {
    return this.http.post<Update>(this.apiUrl, update, this.getHeaders());
  }

  getTodayUpdates(): Observable<Update[]> {
    return this.http.get<Update[]>(`${this.apiUrl}/today`, this.getHeaders());
  }

  deleteUpdateByUserId(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/user/${userId}`, this.getHeaders());
  }

  updateByUserId(userId: string, update: Update): Observable<Update> {
    return this.http.put<Update>(`${this.apiUrl}/user/${userId}`, update, this.getHeaders());
  }
}
