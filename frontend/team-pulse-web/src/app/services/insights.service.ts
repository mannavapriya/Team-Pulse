import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class InsightsService {
  private apiUrl = 'http://3.15.18.189:3000/insights/today';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders() {
    const token = this.authService.getToken();
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  getTodayInsights(): Observable<{ insights: string }> {
    return this.http.get<{ insights: string }>(this.apiUrl, this.getHeaders());
  }
}
