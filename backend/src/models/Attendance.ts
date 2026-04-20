import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendance extends Document {
  staff: mongoose.Types.ObjectId;
  organization: mongoose.Types.ObjectId;
  date: Date;
  status: 'Present' | 'Absent' | 'Late';
  clockIn?: string;
  clockOut?: string;
  note?: string;
}

const attendanceSchema = new Schema({
  staff: {
    type: Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  },
  organization: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Late'],
    default: 'Present'
  },
  clockIn: String,
  clockOut: String,
  note: String
}, {
  timestamps: true
});

// Compound index to ensure one attendance record per staff per day
attendanceSchema.index({ staff: 1, date: 1 }, { unique: true });

export default mongoose.model<IAttendance>('Attendance', attendanceSchema);
