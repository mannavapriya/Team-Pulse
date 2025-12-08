import { ChangeDetectorRef, Component} from '@angular/core';
import { PRReviewService } from '../services/pr-review.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pr-review',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prreview.html'
})
export class PRReviewComponent {
  repoOwner = '';
  repoName = '';
  prNumber: number | null = null;
  githubToken = '';
  reviewOutput: any = null;
  loading = false;

  constructor(private prReviewService: PRReviewService, private authService: AuthService, private router: Router, private cdr: ChangeDetectorRef) {}

  submitReview() {
    if (!this.prNumber) return;

    this.loading = true;
    this.reviewOutput = null;

    this.prReviewService.reviewPR(
      this.repoOwner,
      this.repoName,
      Number(this.prNumber)
    ).subscribe({
      next: res => {
        this.reviewOutput = res;
        this.loading = false;

        // Force Angular to detect the changes
        this.cdr.detectChanges();
      },
      error: err => {
        this.reviewOutput = err;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  goToStandup() {
    this.router.navigate(['/standup']);
  }
  
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
