import mongoose, { Schema, Document } from 'mongoose';

export interface ISchedule extends Document {
  type: 'Student' | 'Tutor';
  class?: mongoose.Types.ObjectId; // For student schedules
  staff?: mongoose.Types.ObjectId; // For tutor schedules
  day: 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  startTime: string; // e.g. "09:00"
  endTime: string; // e.g. "10:00"
  subject: string;
  room: string;
  branch: mongoose.Types.ObjectId;
  organization: mongoose.Types.ObjectId;
}

const scheduleSchema = new Schema<ISchedule>({
  type: { type: String, enum: ['Student', 'Tutor'], required: true },
  class: { type: Schema.Types.ObjectId, ref: 'Class' },
  staff: { type: Schema.Types.ObjectId, ref: 'Staff' },
  day: { 
    type: String, 
    enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], 
    required: true 
  },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  subject: { type: String, required: true },
  room: { type: String, required: true },
  branch: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
  organization: { type: Schema.Types.ObjectId, ref: 'Organization', required: true }
}, { timestamps: true });

export default mongoose.model<ISchedule>('Schedule', scheduleSchema);
