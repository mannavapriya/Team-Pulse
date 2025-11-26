import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UpdatesService, Update } from '../services/updates.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { InsightsService } from '../services/insights.service';
import { NgZone } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  templateUrl: './standup.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class StandupComponent implements OnInit {
  standupForm: FormGroup = new FormGroup({});
  todayUpdates: Update[] = [];
  successMessage: string = '';
  deleteMessage: string = '';
  editingUserId: string | null = null;
  loadingInsights = false;
  insights: SafeHtml | null = null;

  constructor(
    private fb: FormBuilder,
    private updatesService: UpdatesService, private authService: AuthService, private sanitizer: DomSanitizer, private ngZone: NgZone, private insightsService: InsightsService, private router: Router
  ) {}

  ngOnInit() {
    this.standupForm = this.fb.group({
      userId: ['', Validators.required],
      tasks: ['', Validators.required],
      blockers: [''],
      priority: [1, Validators.required],
      mood: ['neutral', Validators.required],
    });

    this.loadTodayUpdates();
  }

  // Submit form for create or update
  async submit() {
    if (this.standupForm.invalid) return;

    const updateData = this.standupForm.value;

    try {
      if (this.editingUserId) {
        // Update existing record
        await this.updatesService.updateByUserId(this.editingUserId, updateData).toPromise();
        this.successMessage = 'Update edited successfully!';
        this.editingUserId = null;
      } else {
        // Create new record
        await this.updatesService.postUpdate(updateData).toPromise();
        this.successMessage = 'Update submitted successfully!';
      }

      this.standupForm.reset({ priority: 1, mood: 'neutral' });
      this.loadTodayUpdates();

      // auto-hide message after 3 seconds
      setTimeout(() => (this.successMessage = ''), 3000);

    } catch (err) {
      console.error(err);
    }
  }

  // Load today's updates
  loadTodayUpdates() {
    this.updatesService.getTodayUpdates().subscribe((updates) => {
      this.todayUpdates = updates;
    });
    this.deleteMessage = '';
  }

  // Delete an update
  async deleteUpdate(userId: string) {
    try {
      const res = await this.updatesService.deleteUpdateByUserId(userId).toPromise();
      if (res) {
        this.deleteMessage = "Update deleted successfully!";
      } else {
        this.deleteMessage = "No update found for this user.";
      }
      this.loadTodayUpdates();
      setTimeout(() => (this.deleteMessage = ''), 3000);
    } catch (err) {
      console.error('Delete failed:', err);
      this.deleteMessage = 'Error deleting update. See console for details.';
    }
  }

  // Populate form for editing
  editUpdate(update: Update) {
    this.editingUserId = update.userId;
    this.standupForm.patchValue({
      userId: update.userId,
      tasks: update.tasks,
      blockers: update.blockers,
      priority: update.priority,
      mood: update.mood,
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
  this.loadingInsights = true;
  this.insights = null; // must be null because we'll store SafeHtml

  this.insightsService.getTodayInsights().subscribe({
    next: (res) => {
      this.ngZone.run(() => {
        this.loadingInsights = false;

        // Convert LLM markdown output to safe HTML
        this.insights = this.convertMarkdownToHtml(res.insights || '');
      });
    },
    error: () => {
      this.ngZone.run(() => {
        this.loadingInsights = false;
        this.insights = this.sanitizer.bypassSecurityTrustHtml(
          'Failed to load insights.'
        );
      });
    }
  });
}


convertMarkdownToHtml(markdown: string): SafeHtml {
  if (!markdown) return this.sanitizer.bypassSecurityTrustHtml('');

  let html = markdown;

  // Headings: ### -> h3, ## -> h2, # -> h1
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-6 mb-2">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-3">$1</h1>');

  // Bold **text**
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');

  // Horizontal rule ---
  html = html.replace(/^---$/gim, '<hr class="my-4 border-gray-300"/>');

  // Lists: - item
  html = html.replace(/^\s*-\s(.*)/gim, '<li class="ml-4 list-disc">$1</li>');
  // Wrap consecutive <li> in <ul>
  html = html.replace(/(<li[\s\S]*?<\/li>)/gim, '<ul>$1</ul>');

  // Tables (basic): replace |...| lines
  html = html.replace(/^\|(.+)\|$/gm, (match) => {
    const cells = match.split('|').slice(1, -1).map(cell => `<td class="border px-2 py-1">${cell.trim()}</td>`);
    return `<tr>${cells.join('')}</tr>`;
  });
  html = html.replace(/(<tr>[\s\S]*?<\/tr>)/gim, '<table class="table-auto border-collapse border border-gray-300 mb-4">$1</table>');

  return this.sanitizer.bypassSecurityTrustHtml(html);
}

}
