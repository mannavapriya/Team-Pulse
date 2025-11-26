// src/app/insights/insights.component.ts
import { Component, OnInit } from '@angular/core';
import { InsightsService } from '../services/insights.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-insights',
  imports: [CommonModule],
  templateUrl: './insights.html',
})
export class InsightsComponent implements OnInit {
  insights: string = '';
  loading = true;

  constructor(private insightsService: InsightsService) {}

  ngOnInit() {
    this.insightsService.getTodayInsights().subscribe({
      next: res => {
        this.insights = res.insights;
        this.loading = false;
      },
      error: err => {
        this.insights = 'Failed to load insights.';
        this.loading = false;
      }
    });
  }
}
