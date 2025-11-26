import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PulseUpdateDocument = PulseUpdate & Document;

@Schema({ timestamps: true })
export class PulseUpdate {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  tasks: string;

  @Prop()
  blockers: string;

  @Prop()
  priority: number;

  @Prop()
  mood: string;
}

export const PulseUpdateSchema = SchemaFactory.createForClass(PulseUpdate);
