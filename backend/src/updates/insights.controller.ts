import { Controller, Get } from '@nestjs/common';
import { InsightsService } from './insights.service';

@Controller('insights')
export class InsightsController {
  constructor(private insightsService: InsightsService) {}

  @Get('today')
  async getTodayInsights() {
    const insights = await this.insightsService.generateInsights();
    return { insights };
  }
}
