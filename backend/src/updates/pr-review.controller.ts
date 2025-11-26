
import { Body, Controller, Post } from '@nestjs/common';
import { PRReviewService } from './pr-review.service';
import { PRReviewDto } from './pr-review.dto';

@Controller('review-pr')
export class PRReviewController {
  constructor(private readonly prReviewService: PRReviewService) {}

  @Post()
  async reviewPR(@Body() dto: PRReviewDto) {
    return this.prReviewService.reviewPR(dto);
  }
}
