
import { Module } from '@nestjs/common';
import { InsightsService } from './insights.service';
import { InsightsController } from './insights.controller';
import { UpdatesModule } from './updates.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [UpdatesModule, ConfigModule],
  providers: [InsightsService],
  controllers: [InsightsController],
  exports: [InsightsService],
})
export class InsightsModule {}
