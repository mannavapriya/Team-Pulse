import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PRReviewService {
  constructor(private http: HttpClient) {}

  reviewPR(repoOwner: string, repoName: string, prNumber: number): Observable<any> {
    return this.http.post('http://18.224.202.131:3000/review-pr', { repoOwner, repoName, prNumber});
  }
}
