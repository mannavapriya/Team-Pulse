import { Module } from '@nestjs/common';
import { PRReviewController } from './pr-review.controller';
import { PRReviewService } from './pr-review.service';

@Module({
  controllers: [PRReviewController],
  providers: [PRReviewService],
})
export class PRReviewModule {}
