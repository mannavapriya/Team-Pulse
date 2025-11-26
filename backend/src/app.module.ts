import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UpdatesModule } from './updates/updates.module';
import { UsersModule } from './updates/users.module';
import { AuthModule } from './updates/auth.module';
import { InsightsModule } from './updates/insights.module';
import { PRReviewModule } from './updates/pr-review.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/teampulse'),
    UsersModule,
    AuthModule,
    UpdatesModule,
    InsightsModule,
    PRReviewModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
