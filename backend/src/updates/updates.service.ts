import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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

  // Delete by MongoDB _id
  async deleteById(id: string): Promise<{ deletedCount: number }> {
    if (!Types.ObjectId.isValid(id)) {
      return { deletedCount: 0 };
    }
    const result = await this.updateModel.deleteOne({ _id: id }).exec();
    return result;
  }

  // Update by MongoDB _id
  async updateById(id: string, updateDto: Partial<PulseUpdate>): Promise<PulseUpdate | null> {
    if (!Types.ObjectId.isValid(id)) return null;

    return this.updateModel.findByIdAndUpdate(
      id,
      updateDto,
      { new: true }
    ).exec();
  }
}
