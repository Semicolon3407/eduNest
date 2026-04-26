import mongoose, { Schema, Document } from 'mongoose';

export interface IAnnouncement extends Document {
  title: string;
  content: string;
  type: 'Administrative' | 'Event' | 'Academic' | 'Other';
  organization: mongoose.Types.ObjectId;
  branch: mongoose.Types.ObjectId;
  class?: mongoose.Types.ObjectId;
  category: 'STUDENT' | 'STAFF' | 'ALL';
  date: Date;
}

const announcementSchema = new Schema<IAnnouncement>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['Administrative', 'Event', 'Academic', 'Other'], default: 'Administrative' },
  organization: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  branch: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
  class: { type: Schema.Types.ObjectId, ref: 'Class' },
  category: { type: String, enum: ['STUDENT', 'STAFF', 'ALL'], default: 'ALL' },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model<IAnnouncement>('Announcement', announcementSchema);
