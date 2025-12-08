import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UpdatesService, Update } from '../services/updates.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { InsightsService } from '../services/insights.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  templateUrl: './standup.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class StandupComponent implements OnInit {
  standupForm!: FormGroup;
  todayUpdates: Update[] = [];
  successMessage = '';
  deleteMessage = '';
  editingId: string | null = null; // <-- MongoDB _id

  loadingInsights = false;
  insights: SafeHtml | null = null;

  constructor(
    private fb: FormBuilder,
    private updatesService: UpdatesService,
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    private insightsService: InsightsService,
    private router: Router, private ngZone: NgZone,
  private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit() {
    this.standupForm = this.fb.group({
      userId: ['', Validators.required],
      tasks: ['', Validators.required],
      blockers: [''],
      priority: [Validators.required],
      mood: ['neutral', Validators.required],
    });

    this.loadTodayUpdates();
  }

  // CREATE or UPDATE
async submit() {
  if (this.standupForm.invalid) return;
  const data = this.standupForm.value;

  try {
    if (this.editingId) {
      await this.updatesService.update(this.editingId, data).toPromise();
    } else {
      await this.updatesService.create(data).toPromise();
    }

    this.ngZone.run(() => {
      this.standupForm.reset({ mood: 'neutral' });
      this.loadTodayUpdates();
      this.successMessage = this.editingId ? 'Update edited successfully!' : 'Update submitted successfully!';
      this.editingId = null;
      this.cdr.detectChanges();

      setTimeout(() => {
        this.ngZone.run(() => {
          this.successMessage = '';
          this.cdr.detectChanges();
        });
      }, 2000);
    });
  } catch (err) {
    console.error(err);
  }
}

  // LOAD
 loadTodayUpdates() {
  this.updatesService.getTodayUpdates().subscribe({
    next: (updates) => {
      this.ngZone.run(() => {
        this.todayUpdates = updates;
        this.cdr.detectChanges();
      });
    },
    error: (err) => console.error('API ERROR:', err),
  });
}

getDevStatus(priority: number): { label: string; color: string } {
  switch (priority) {
    case 1:
      return { label: 'Need Help', color: 'text-red-600' };
    case 2:
      return { label: 'Working on It', color: 'text-yellow-600' };
    case 3:
      return { label: 'All Good', color: 'text-green-600' };
    default:
      return { label: 'Unknown', color: 'text-gray-600' };
  }
}


  // DELETE by MongoDB _id
  async deleteUpdate(id: string) {
  try {
    const result: any = await this.updatesService.delete(id).toPromise();

    this.ngZone.run(() => {
      if (result?.deletedCount === 1) {
        this.deleteMessage = 'Update deleted successfully!';
      } else {
        this.deleteMessage = 'No update found.';
      }

      this.loadTodayUpdates();
      this.cdr.detectChanges();

      setTimeout(() => {
        this.ngZone.run(() => {
          this.deleteMessage = '';
          this.cdr.detectChanges();
        });
      }, 2000);
    });

  } catch (err) {
    console.error('Delete failed:', err);
    this.ngZone.run(() => {
      this.deleteMessage = 'Error deleting update.';
      this.cdr.detectChanges();
    });
  }
}


  // EDIT
  editUpdate(u: Update) {
    this.editingId = u._id ?? null;

    this.standupForm.patchValue({
      userId: u.userId,
      tasks: u.tasks,
      blockers: u.blockers,
      priority: u.priority,
      mood: u.mood,
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToPRReview() {
    this.router.navigate(['/pr-review']);
  }

 showInsights() {
  this.ngZone.run(() => {
    this.loadingInsights = true;
    this.insights = null;
    this.cdr.detectChanges();
  });

  this.insightsService.getTodayInsights().subscribe({
    next: (res) => {
      this.ngZone.run(() => {
        this.loadingInsights = false;
        this.insights = this.convertMarkdownToHtml(res.insights || '');
        this.cdr.detectChanges();
      });
    },
    error: () => {
      this.ngZone.run(() => {
        this.loadingInsights = false;
        this.insights = this.sanitizer.bypassSecurityTrustHtml('Failed to load insights.');
        this.cdr.detectChanges();
      });
    }
  });
}


  convertMarkdownToHtml(md: string): SafeHtml {
    if (!md) return this.sanitizer.bypassSecurityTrustHtml('');

    let html = md;

    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
    html = html.replace(/^\s*-\s(.*)/gim, '<li>$1</li>');
    html = html.replace(/(<li>[\s\S]*?<\/li>)/gim, '<ul>$1</ul>');

    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
