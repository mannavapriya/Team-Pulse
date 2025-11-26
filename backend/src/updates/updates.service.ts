import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PulseUpdate, PulseUpdateDocument } from './schemas/update.schema';

@Injectable()
export class UpdatesService {
  constructor(
    @InjectModel(PulseUpdate.name) private updateModel: Model<PulseUpdateDocument>,
  ) {}

  // Create a new update
  async create(updateDto: Partial<PulseUpdate>): Promise<PulseUpdate> {
    const created = new this.updateModel(updateDto);
    return created.save();
  }

  // Get all updates for today
  async findTodayTeam(): Promise<PulseUpdate[]> {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    return this.updateModel.find({
      createdAt: { $gte: start, $lte: end },
    }).exec();
  }

  // Optional: upsert per user per day
  async createOrUpdate(userId: string, updateDto: Partial<PulseUpdate>): Promise<PulseUpdate> {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    return this.updateModel.findOneAndUpdate(
      { userId, createdAt: { $gte: start, $lte: end } },
      updateDto,
      { new: true, upsert: true },
    ).exec();
  }

  async deleteByUserId(userId: string): Promise<boolean> {
    const result = await this.updateModel.deleteOne({ userId }).exec();
    return result.deletedCount > 0;
  }

  // Update an existing update for a given user
  async updateByUserId(userId: string, updateDto: Partial<PulseUpdate>): Promise<PulseUpdate | null> {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    return this.updateModel.findOneAndUpdate(
      { userId, createdAt: { $gte: start, $lte: end } },
      updateDto,
      { new: true }
    ).exec();
  }

}
