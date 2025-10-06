import { HydratedDocument } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type AlarmViewDocument = HydratedDocument<AlarmView>;

@Schema({
  id: false,
  _id: false,
})
export class AlarmViewEntry {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: string;
}

export const AlarmViewEntrySchema = SchemaFactory.createForClass(AlarmViewEntry);

@Schema({
  id: false,
  _id: false,
  timestamps: true,
})
export class AlarmView {
  @Prop({ required: true, unique: true, index: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  severity: string;

  @Prop()
  triggeredAt: Date;

  @Prop()
  isAcknowledged: boolean;

  @Prop({
    type: [AlarmViewEntrySchema],
  })
  entries: Array<AlarmViewEntry>;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const AlarmViewSchema = SchemaFactory.createForClass(AlarmView);
