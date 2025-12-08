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
  private apiUrl = 'http://3.15.18.189:3000/updates';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): { headers: HttpHeaders } {
    const token = this.authService.getToken();
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  // Match component method
  create(update: Update): Observable<Update> {
    return this.http.post<Update>(this.apiUrl, update, this.getHeaders());
  }

  getTodayUpdates(): Observable<Update[]> {
    return this.http.get<Update[]>(`${this.apiUrl}/today`, this.getHeaders());
  }

  // Match component method
  update(id: string, update: Update): Observable<Update> {
    return this.http.put<Update>(`${this.apiUrl}/${id}`, update, this.getHeaders());
  }

  // Match component method
  delete(id: string): Observable<{ deletedCount: number }> {
    return this.http.delete<{ deletedCount: number }>(`${this.apiUrl}/${id}`, this.getHeaders());
  }
}
