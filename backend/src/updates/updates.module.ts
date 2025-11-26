import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UpdatesService } from './updates.service';
import { UpdatesController } from './updates.controller';
import { PulseUpdate, PulseUpdateSchema } from './schemas/update.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: PulseUpdate.name, schema: PulseUpdateSchema }]),
  ],
  providers: [UpdatesService],
  controllers: [UpdatesController],
  exports: [UpdatesService]
})
export class UpdatesModule {}
